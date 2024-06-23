import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type BackendApp from "../../../../../backend/src/index";

declare global {
  interface CloudflareEnv {
    BACKEND: Service<BackendApp>;
  }
}

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { env } = getRequestContext();

  return new Response((await env.BACKEND.add(3, 10)).toString(), {
    headers: {
      "content-type": "text/plain",
    },
  });
}
