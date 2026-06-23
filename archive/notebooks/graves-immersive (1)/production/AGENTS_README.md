# Agents Autopilot — One-Button Video Production

This repo includes a cloud workflow that renders all scenes using your Sora-compatible provider, downloads masters, and encodes HLS — with no local setup.

## What you do (2 minutes)

1. Add two repository secrets (once):
   - `SORA_API_URL` — e.g., `https://api.sora.yourvendor.com`
   - `SORA_API_KEY` — your API key (paste the value)
   Where: GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret.

2. Run the workflow:
   - GitHub → Actions tab → “Video Production Autopilot” → “Run workflow”
   - Choose:
     - `codec`: `h264` (best compatibility) or `hevc` (higher quality/efficiency on Apple)
     - `scenes` (optional): CSV of IDs to run (leave empty for all)
     - `concurrency`: parallel jobs (e.g., 2)
   - Click the green “Run workflow” button.

That’s it. Agents handle the rest in the cloud.

## What happens behind the scenes

- The workflow calls `scripts/produce.mjs`:
  - Reads `production/Sora_Batch.jsonl`
  - Submits each job to your provider (via `POST /jobs`)
  - Polls `GET /jobs/:id` until status = `completed`
  - Downloads the master video to `out/raw/{ID}.mov`
  - Encodes HLS via the included ffmpeg scripts to `out/Web_HLS/{ID}/index.m3u8`
- When finished, GitHub attaches a downloadable “video_outputs” artifact containing:
  - `out/raw` — masters
  - `out/Web_HLS` — HLS ladders (4K–540p variants + master playlists)

## Provider assumptions (adapt if needed)

We expect responses like:
- Submit: `POST /jobs` → `{ id: "job_abc", status: "queued" }`
- Poll: `GET /jobs/{id}` → `{ status: "completed", artifacts: { video: "https://..." } }`

If your provider returns different fields, adjust the mapping in:
- `scripts/produce.mjs` → `submitJob()` and `pollJob()` functions (marked with comments).

No npm packages are required; Node 20’s `fetch` is used. ffmpeg is installed on the runner.

## Optional — Deploy to your CDN automatically

Add a final deploy step (S3 example) to `.github/workflows/produce.yml` and set secrets:
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`

Example step:
```yaml
      - name: Sync HLS to S3
        if: ${{ success() }}
        run: |
          aws s3 sync out/Web_HLS s3://${{ secrets.AWS_S3_BUCKET }}/cdn/
```

## Troubleshooting

- Missing URL/key: The workflow will fail fast if `SORA_API_URL` or `SORA_API_KEY` aren’t set.
- No video URL in response: The script will error if `artifacts.video` is absent — update `pollJob()` JSON path to match your provider’s response.
- Timeouts: Long renders may hit the 60-minute poll cap; raise that in `pollJob()` if needed.

## After production

- Download artifacts from the job page → “video_outputs”.
- If you added deploy, your HLS will be available at your CDN path.
- Integrate into the app per `production/Integration_Guide.md` (already in repo).

