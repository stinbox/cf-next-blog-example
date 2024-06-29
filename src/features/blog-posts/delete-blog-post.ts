import { database } from "@/database";
import { blogPosts, publishedBlogPosts, users } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";

export const deleteBlogPost = async (id: string): Promise<BlogPost> => {
  const [[deletedPublishedBlogPost], [deletedBlogPost]] =
    await database().batch([
      database()
        .select()
        .from(publishedBlogPosts)
        .where(eq(publishedBlogPosts.id, id)),

      database().delete(blogPosts).where(eq(blogPosts.id, id)).returning(),
    ]);

  if (deletedBlogPost == null) {
    throw new Error("Blog post not found");
  }

  const createdBy = await database().query.users.findFirst({
    where: eq(users.id, deletedBlogPost.createdBy),
    columns: { id: true, name: true, image: true },
  });

  if (createdBy == null) {
    throw new Error("User not found");
  }

  return {
    id: deletedBlogPost.id,
    title: deletedBlogPost.title,
    content: deletedBlogPost.content,
    createdAt: deletedBlogPost.createdAt.toISOString(),
    updatedAt: deletedBlogPost.updatedAt.toISOString(),
    publishedAt: deletedPublishedBlogPost?.publishedAt.toISOString() ?? null,
    createdBy: {
      id: createdBy.id,
      name: createdBy.name,
      image: createdBy.image,
    },
    isDraft:
      deletedPublishedBlogPost == null ||
      deletedBlogPost.updatedAt > deletedPublishedBlogPost.updatedAt,
  };
};
