import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// Try both possible content locations
async function findContentRoot(): Promise<string> {
  const candidates = [
    path.join(process.cwd(), "content"),
    path.join(process.cwd(), "apps", "web", "content"),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Continue to next candidate
    }
  }

  // Fallback to first option
  return candidates[0];
}

function isSafeRelativePath(value: string): boolean {
  if (value.includes("..")) {
    return false;
  }
  if (path.isAbsolute(value)) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const doc = url.searchParams.get("doc");

  if (!doc || typeof doc !== "string") {
    return NextResponse.json(
      { error: "Missing query param `doc`." },
      { status: 400 }
    );
  }

  if (!isSafeRelativePath(doc)) {
    return NextResponse.json({ error: "Invalid doc path." }, { status: 400 });
  }

  const CONTENT_ROOT = await findContentRoot();
  const resolved = path.join(CONTENT_ROOT, doc);

  if (!resolved.startsWith(CONTENT_ROOT + path.sep)) {
    return NextResponse.json({ error: "Invalid doc path." }, { status: 400 });
  }

  try {
    const content = await fs.readFile(resolved, "utf8");
    return NextResponse.json({ doc, content }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Doc not found." }, { status: 404 });
  }
}
