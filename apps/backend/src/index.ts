import { WorkerEntrypoint } from "cloudflare:workers";

export default class BackendApp extends WorkerEntrypoint {
  async fetch() {
    return new Response("Hello from the backend!");
  }

  add(n1: number, n2: number) {
    return n1 + n2;
  }
}
