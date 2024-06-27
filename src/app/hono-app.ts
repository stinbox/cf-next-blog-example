import { auth } from "@/auth";
import { Hono } from "hono";
import { Session } from "next-auth";

type HonoEnv = {
  Bindings: {
    [K in keyof CloudflareEnv]: CloudflareEnv[K];
  };
  Variables: {
    session: Session;
  };
};

export const honoApp = new Hono<HonoEnv>()
  .basePath("/api")

  .use(async (c, next) => {
    const session = await auth();
    if (session) {
      c.set("session", session);
      return next();
    }
    return c.json({ error: "Unauthorized" }, { status: 401 });
  })

  .get("/blog-posts/:id", async (c) => {
    return c.json({
      session: c.get("session"),
      id: c.req.param("id"),
    });
  })
  .all("/*", (c) => {
    return c.text("Not Found", { status: 404 });
  });

export type HonoApp = typeof honoApp;
