import { database } from "@/database";
import { blogPosts, publishedBlogPosts, users } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";
import * as v from "valibot";

export const UpdateBlogPostInput = v.object({
  title: v.pipe(v.string(), v.maxLength(100)),
  content: v.pipe(v.string(), v.maxLength(100000)),
  operation: v.picklist(["publish", "draft"]),
});

type UpdateBlogPostInput = v.InferOutput<typeof UpdateBlogPostInput>;

export const updateBlogPost = async (
  id: string,
  input: UpdateBlogPostInput
): Promise<BlogPost> => {
  const [existingBlogPost, [existingPublished]] = await database().batch([
    database().query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    }),

    database()
      .select()
      .from(publishedBlogPosts)
      .where(eq(publishedBlogPosts.id, id)),
  ]);

  if (existingBlogPost == null) {
    throw new Error("Blog post not found");
  }

  const now = new Date();

  const [[updatedBlogPost], [updatedPublishedBlogPost], createdBy] =
    await database().batch([
      database()
        .update(blogPosts)
        .set({
          title: input.title,
          content: input.content,
          updatedAt: now,
        })
        .where(eq(blogPosts.id, id))
        .returning(),

      input.operation === "publish"
        ? existingPublished
          ? database()
              .update(publishedBlogPosts)
              .set({
                title: input.title,
                content: input.content,
                updatedAt: now,
              })
              .where(eq(publishedBlogPosts.id, existingPublished.id))
              .returning()
          : database()
              .insert(publishedBlogPosts)
              .values({
                id: existingBlogPost.id,
                title: input.title ?? existingBlogPost.title,
                content: input.content ?? existingBlogPost.content,
                publishedAt: now,
                updatedAt: now,
              })
              .returning()
        : database()
            .select()
            .from(publishedBlogPosts)
            .where(eq(publishedBlogPosts.id, id)),

      database().query.users.findFirst({
        where: eq(users.id, existingBlogPost.createdBy),
        columns: { id: true, name: true, image: true },
      }),
    ]);

  if (updatedBlogPost == null) {
    throw new Error("Failed to update blog post");
  }

  if (createdBy == null) {
    throw new Error("User not found");
  }

  return {
    id: updatedBlogPost.id,
    title: updatedBlogPost.title,
    content: updatedBlogPost.content,
    createdAt: updatedBlogPost.createdAt.toISOString(),
    updatedAt: updatedBlogPost.updatedAt.toISOString(),
    createdBy: {
      id: createdBy.id,
      name: createdBy.name,
      image: createdBy.image,
    },
    publishedAt: updatedPublishedBlogPost?.publishedAt.toISOString() ?? null,
    isDraft:
      updatedPublishedBlogPost == null ||
      updatedBlogPost.updatedAt > updatedPublishedBlogPost.updatedAt,
  };
};
