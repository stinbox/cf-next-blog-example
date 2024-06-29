import { database } from "@/database";
import { blogPosts, users } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";
import * as v from "valibot";

export const CreateBlogPostInput = v.object({
  title: v.pipe(v.string(), v.maxLength(100)),
  content: v.pipe(v.string(), v.maxLength(100000)),
  published: v.boolean(),
});

type CreateBlogPostInput = v.InferOutput<typeof CreateBlogPostInput>;

export const createBlogPost = async (
  userId: string,
  input: CreateBlogPostInput
): Promise<BlogPost> => {
  const [[created], createdBy] = await database().batch([
    database()
      .insert(blogPosts)
      .values({
        title: input.title,
        content: input.content,
        createdBy: userId,
        publishedAt: input.published ? new Date() : null,
      })
      .returning(),

    database().query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, name: true, image: true },
    }),
  ]);

  if (createdBy == null) {
    throw new Error("User not found");
  }

  return {
    id: created.id,
    title: created.title,
    content: created.content,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    createdBy: {
      id: createdBy.id,
      name: createdBy.name,
      image: createdBy.image,
    },
  };
};
