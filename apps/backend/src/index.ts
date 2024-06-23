import { Hono } from "hono";
import { WorkerEntrypoint } from "cloudflare:workers";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default class BackendApp extends WorkerEntrypoint {
  async fetch() {
    return new Response("Hello from the backend!");
  }

  add(n1: number, n2: number) {
    return n1 + n2;
  }
}
