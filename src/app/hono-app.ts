import { auth } from "@/auth";
import {
  CreateBlogPostInput,
  createBlogPost,
} from "@/features/blog-posts/create-blog-post";
import { deleteBlogPost } from "@/features/blog-posts/delete-blog-post";
import { getBlogPost } from "@/features/blog-posts/get-blog-post";
import { isUsersBlogPost } from "@/features/blog-posts/is-users-blog-post";
import {
  UpdateBlogPostInput,
  updateBlogPost,
} from "@/features/blog-posts/update-blog-post";
import { vValidator } from "@hono/valibot-validator";
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

  .post("/blog-posts", vValidator("json", CreateBlogPostInput), async (c) => {
    const session = c.get("session");
    const created = await createBlogPost(session.user.id, c.req.valid("json"));
    return c.json(created);
  })

  // This middleware checks if the blog post is created by the user
  .use("/blog-posts/:id", async (c, next) => {
    const session = c.get("session");
    const blogPostId = c.req.param("id");
    if (await isUsersBlogPost(session.user.id, blogPostId)) {
      return next();
    }
    return c.json({ error: "Forbidden" }, { status: 403 });
  })

  .get("/blog-posts/:id", async (c) => {
    const found = await getBlogPost(c.req.param("id"));
    if (!found) return c.json({ error: "Not Found" }, { status: 404 });
    return c.json(found);
  })

  .put(
    "/blog-posts/:id",
    vValidator("json", UpdateBlogPostInput),
    async (c) => {
      const updated = await updateBlogPost(
        c.req.param("id"),
        c.req.valid("json")
      );
      return c.json(updated);
    }
  )

  .delete("/blog-posts/:id", async (c) => {
    const deleted = await deleteBlogPost(c.req.param("id"));
    return c.json(deleted);
  })

  .all("/*", (c) => {
    return c.text("Not Found", { status: 404 });
  });

export type HonoApp = typeof honoApp;
