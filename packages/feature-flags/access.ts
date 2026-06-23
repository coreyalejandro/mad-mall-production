import { type ApiData, verifyAccess } from "flags";
import { NextResponse } from "next/server";
import * as flags from "./index";

// Accept the standard web Request type to avoid NextRequest instance conflicts
// across pnpm peer-dep variations of next. NextRequest extends Request, so
// apps/web can pass its NextRequest directly.
export const getFlags = async (request: Request) => {
  const access = await verifyAccess(request.headers.get("Authorization"));

  if (!access) {
    return NextResponse.json(null, { status: 401 });
  }

  const definitions = Object.fromEntries(
    Object.values(flags).map((flag) => [
      flag.key,
      {
        origin: flag.origin,
        description: flag.description,
        options: flag.options,
      },
    ])
  );

  return NextResponse.json<ApiData>({
    definitions,
  });
};
