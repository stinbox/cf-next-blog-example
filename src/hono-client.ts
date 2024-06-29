import { hc } from "hono/client";
import { HonoApp } from "@/hono-app";

export const apiClient = hc<HonoApp>("");
