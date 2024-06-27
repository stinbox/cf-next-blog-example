import { honoApp } from "@/app/hono-app";

const handler = (request: Request) => honoApp.fetch(request);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as HEAD,
  handler as OPTIONS,
};
