import { NextResponse, type NextRequest } from "next/server";

// Shared-password gate for a small private deployment. Disabled when SITE_PASSWORD is unset (local dev).
const PASSWORD = process.env.SITE_PASSWORD;

function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(request: NextRequest) {
  if (!PASSWORD) return NextResponse.next();
  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    const password = decoded.slice(decoded.indexOf(":") + 1);
    if (sameString(password, PASSWORD)) return NextResponse.next();
  }
  return new NextResponse("Cần mật khẩu để vào QA Academy.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="QA Academy", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
