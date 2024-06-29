import { database } from "@/database";
import { blogPosts, publishedBlogPosts, users } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";
import { ulid } from "ulidx";
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
  const blogPostId = ulid();
  const now = new Date();

  const [[createdBlogPost], [createdPublishedBlogPost], createdBy] =
    await database().batch([
      database()
        .insert(blogPosts)
        .values({
          id: blogPostId,
          title: input.title,
          content: input.content,
          createdBy: userId,
          createdAt: now,
          updatedAt: now,
        })
        .returning(),

      input.published
        ? database()
            .insert(publishedBlogPosts)
            .values({
              id: blogPostId,
              title: input.title,
              content: input.content,
              publishedAt: now,
              updatedAt: now,
            })
            .returning()
        : database()
            .select()
            .from(publishedBlogPosts)
            .where(eq(publishedBlogPosts.id, blogPostId)),

      database().query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true, name: true, image: true },
      }),
    ]);

  if (createdBlogPost == null) {
    throw new Error("Failed to create blog post");
  }

  if (createdBy == null) {
    throw new Error("User not found");
  }

  return {
    id: createdBlogPost.id,
    title: createdBlogPost.title,
    content: createdBlogPost.content,
    createdAt: createdBlogPost.createdAt.toISOString(),
    updatedAt: createdBlogPost.updatedAt.toISOString(),
    createdBy: {
      id: createdBy.id,
      name: createdBy.name,
      image: createdBy.image,
    },
    publishedAt: createdPublishedBlogPost?.publishedAt.toISOString() ?? null,
    isDraft: createdPublishedBlogPost == null,
  };
};
