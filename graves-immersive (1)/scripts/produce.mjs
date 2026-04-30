#!/usr/bin/env node
/**
 * @file scripts/produce.mjs
 * @description Cloud-friendly orchestrator that reads production/Sora_Batch.jsonl,
 * submits each job to a render provider (Sora-compatible), polls until completion,
 * downloads masters, and encodes HLS using the provided bash scripts. Outputs are
 * written to ./out/raw and ./out/Web_HLS. Designed to run under GitHub Actions,
 * but also works locally if ffmpeg is installed and env vars are set.
 *
 * Env vars:
 * - SORA_API_URL: Base URL for your render provider (e.g., https://api.sora.example.com)
 * - SORA_API_KEY: Bearer token or API key for provider
 * - CODEC: "h264" (default) or "hevc"
 * - SCENES: optional CSV list of scene ids to include (e.g., "03_thyroid,03_thyroid_RM")
 * - CONCURRENCY: number of parallel jobs (default "2")
 *
 * Inputs:
 * - production/Sora_Batch.jsonl — one JSON object per line describing a scene job.
 *
 * Outputs:
 * - out/raw/{ID}.mov — downloaded master files (as provided by your renderer)
 * - out/Web_HLS/{ID}/index.m3u8 — HLS playback ladders encoded by ffmpeg scripts
 *
 * Assumptions:
 * - Provider accepts a POST /jobs with a JSON body roughly matching our manifest,
 *   returns { id, status } and supports GET /jobs/:id returning status + download URL(s).
 * - Download URL provided as jobs[i].artifacts.video (MOV/MP4).
 * - If your provider differs, adjust submitJob() / pollJob() mapping noted below.
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"

// Resolve project root relative to this script location
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")
const batchPath = path.join(root, "production", "Sora_Batch.jsonl")
const outDir = path.join(root, "out")
const rawDir = path.join(outDir, "raw")
const hlsRoot = path.join(outDir, "Web_HLS")
const toolsDir = path.join(root, "production", "tools")

// Config via env
const API_URL = process.env.SORA_API_URL || ""
const API_KEY = process.env.SORA_API_KEY || ""
const CODEC = (process.env.CODEC || "h264").toLowerCase() // "h264" | "hevc"
const SCENES_FILTER = (process.env.SCENES || "").trim()
const CONCURRENCY = Math.max(1, parseInt(process.env.CONCURRENCY || "2", 10))

/**
 * @typedef {Object} RenderJob
 * @property {string} id - Unique scene id (e.g., "03_thyroid")
 * @property {number} [seed]
 * @property {number} [duration_seconds]
 * @property {number} [fps]
 * @property {string} [resolution]
 * @property {string} [prompt]
 * @property {string} [negative_prompt]
 * @property {string} [based_on]
 * @property {boolean} [reduce_motion]
 * @property {number} [velocity_scale]
 * @property {number} [guidance_strength]
 * @property {number} [variation_amount]
 * @property {string} [same_actor]
 * @property {boolean} [keep_character]
 */

/**
 * Ensures necessary directories exist.
 */
async function ensureDirs() {
  await fs.mkdir(outDir, { recursive: true })
  await fs.mkdir(rawDir, { recursive: true })
  await fs.mkdir(hlsRoot, { recursive: true })
}

/**
 * Reads the JSONL batch file and returns an array of RenderJob entries.
 * @returns {Promise<RenderJob[]>}
 */
async function readBatch() {
  const content = await fs.readFile(batchPath, "utf-8")
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  /** @type {RenderJob[]} */
  const jobs = []
  for (const line of lines) {
    try {
      const obj = JSON.parse(line)
      if (obj.id) jobs.push(obj)
    } catch (err) {
      console.warn("Skipping invalid JSONL line:", line)
    }
  }
  // Optional filter by SCENES CSV
  if (SCENES_FILTER) {
    const set = new Set(
      SCENES_FILTER.split(",").map((s) => s.trim()).filter(Boolean)
    )
    return jobs.filter((j) => set.has(j.id))
  }
  return jobs
}

/**
 * Submits a render job to the provider.
 * NOTE: Adapt the endpoint/shape if your provider differs.
 * @param {RenderJob} job
 * @returns {Promise<{providerJobId: string, status: string}>}
 */
async function submitJob(job) {
  if (!API_URL || !API_KEY) {
    throw new Error("Missing SORA_API_URL or SORA_API_KEY")
  }
  const res = await fetch(`${API_URL.replace(/\/+$/, "")}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(job),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Submit failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  // Expected shape: { id: "abc", status: "queued" }
  return { providerJobId: data.id, status: data.status || "queued" }
}

/**
 * Polls a job until completion or failure and returns a download URL.
 * NOTE: Adapt JSON path if your provider returns a different structure.
 * @param {string} providerJobId
 * @returns {Promise<{status: string, downloadUrl: string}>}
 */
async function pollJob(providerJobId) {
  const maxWaitMs = 1000 * 60 * 60 // 60 min safety
  const start = Date.now()
  const poll = async () => {
    const res = await fetch(
      `${API_URL.replace(/\/+$/, "")}/jobs/${encodeURIComponent(providerJobId)}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    )
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Poll failed (${res.status}): ${text}`)
    }
    const data = await res.json()
    // Expected final: { status: "completed", artifacts: { video: "https://..." } }
    const status = data.status
    if (status === "completed") {
      const url =
        data.artifacts?.video ||
        data.output?.video ||
        data.result?.video ||
        ""
      if (!url) {
        throw new Error("Completed but no video URL present in response")
      }
      return { status, downloadUrl: url }
    }
    if (status === "failed" || status === "canceled") {
      throw new Error(`Job ${providerJobId} ${status}`)
    }
    if (Date.now() - start > maxWaitMs) {
      throw new Error("Polling timeout exceeded")
    }
    await new Promise((r) => setTimeout(r, 8000))
    return poll()
  }
  return poll()
}

/**
 * Downloads a file from a URL to a destination path.
 * @param {string} url
 * @param {string} destPath
 */
async function downloadFile(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Download failed (${res.status}): ${text}`)
  }
  const file = await fs.open(destPath, "w")
  try {
    const writer = file.createWriteStream()
    await new Promise((resolve, reject) => {
      res.body.pipeTo(
        new WritableStream({
          write(chunk) {
            writer.write(Buffer.from(chunk))
          },
          close() {
            writer.end(resolve)
          },
          abort(err) {
            writer.destroy(err)
            reject(err)
          },
        })
      ).catch(reject)
    })
  } finally {
    await file.close()
  }
}

/**
 * Encodes HLS ladder using our provided bash tools.
 * @param {string} inputMov
 * @param {string} sceneId
 */
async function encodeHls(inputMov, sceneId) {
  const outSceneDir = path.join(hlsRoot, sceneId)
  await fs.mkdir(outSceneDir, { recursive: true })
  const script =
    CODEC === "hevc"
      ? path.join(toolsDir, "encode_hls_hevc.sh")
      : path.join(toolsDir, "encode_hls_h264.sh")

  await new Promise((resolve, reject) => {
    const proc = spawn("bash", [script, inputMov, outSceneDir], {
      stdio: "inherit",
    })
    proc.on("exit", (code) => {
      if (code === 0) resolve(undefined)
      else reject(new Error(`HLS encode failed with code ${code}`))
    })
  })
}

/**
 * Simple promise pool to run jobs with limited concurrency.
 * @template T
 * @param {Array<() => Promise<T>>} tasks
 * @param {number} concurrency
 * @returns {Promise<T[]>}
 */
async function runPool(tasks, concurrency) {
  /** @type {T[]} */
  const results = []
  let idx = 0
  let active = 0
  return new Promise((resolve, reject) => {
    const next = () => {
      if (idx >= tasks.length && active === 0) return resolve(results)
      while (active < concurrency && idx < tasks.length) {
        const i = idx++
        active++
        tasks[i]()
          .then((r) => results.push(r))
          .catch(reject)
          .finally(() => {
            active--
            next()
          })
      }
    }
    next()
  })
}

/**
 * Executes the orchestration.
 */
async function main() {
  console.log("Video Production Orchestrator starting…")
  console.log(`Provider: ${API_URL || "(missing)"} | Codec: ${CODEC}`)
  await ensureDirs()
  const jobs = await readBatch()
  if (!jobs.length) {
    console.error("No jobs found. Check production/Sora_Batch.jsonl")
    process.exit(1)
  }
  console.log(`Total jobs to process: ${jobs.length}`)
  const tasks = jobs.map((job) => async () => {
    console.log(`\n=== ${job.id} ===`)
    // Submit
    const { providerJobId } = await submitJob(job)
    console.log(`Submitted: ${job.id} → providerJobId=${providerJobId}`)
    // Poll
    const { downloadUrl } = await pollJob(providerJobId)
    console.log(`Completed: ${job.id} → ${downloadUrl}`)
    // Download
    const movPath = path.join(rawDir, `${job.id}.mov`)
    await downloadFile(downloadUrl, movPath)
    console.log(`Downloaded to ${movPath}`)
    // HLS
    await encodeHls(movPath, job.id)
    console.log(`HLS encoded at out/Web_HLS/${job.id}/index.m3u8`)
    return { id: job.id }
  })

  await runPool(tasks, CONCURRENCY)

  console.log("\nAll jobs processed successfully.")
  console.log("Outputs:")
  console.log(`- Masters: ${path.relative(root, rawDir)}`)
  console.log(`- HLS: ${path.relative(root, hlsRoot)}`)
}

main().catch((err) => {
  console.error("\nFATAL:", err?.stack || err?.message || err)
  process.exit(1)
})
