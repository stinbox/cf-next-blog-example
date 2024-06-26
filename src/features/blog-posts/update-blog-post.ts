import { database } from "@/database";
import { blogPosts, users } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";
import * as v from "valibot";

export const UpdateBlogPostInput = v.object({
  title: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
  content: v.optional(v.string()),
});

type UpdateBlogPostInput = v.InferOutput<typeof UpdateBlogPostInput>;

export const updateBlogPost = async (
  id: string,
  input: UpdateBlogPostInput
): Promise<BlogPost> => {
  const updated = await database()
    .update(blogPosts)
    .set({
      title: input.title,
      content: input.content,
    })
    .where(eq(blogPosts.id, id))
    .returning()
    .get();

  const createdBy = await database().query.users.findFirst({
    where: eq(users.id, updated.createdBy),
    columns: { id: true, name: true, image: true },
  });

  if (createdBy == null) {
    throw new Error("User not found");
  }

  return {
    id: updated.id,
    title: updated.title,
    content: updated.content,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    createdBy: {
      id: createdBy.id,
      name: createdBy.name,
      image: createdBy.image,
    },
  };
};
