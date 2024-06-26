import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { env } = getRequestContext();

  return new Response("Hello world", {
    headers: {
      "content-type": "text/plain",
    },
  });
}
