import { getFlags } from "@repo/feature-flags/access";

export async function GET(request: Request) {
  return getFlags(request);
}
