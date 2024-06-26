import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./database-schema";

export const database = () => {
  return drizzle(getRequestContext().env.DB, { schema });
};
