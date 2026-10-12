import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ nextauth: string[] }> };
async function handler(request: NextRequest, context: Context) {
  return NextAuth(authOptions())(request, context);
}
export { handler as GET, handler as POST };
