import { database } from "@/database";
import { blogPosts } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  const post = await database().query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
      published: true,
    },
  });

  if (post == null) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    createdBy: {
      id: post.user.id,
      name: post.user.name,
      image: post.user.image,
    },
    publishedAt: post.published?.publishedAt.toISOString() ?? null,
    isDraft:
      post.published == null || post.updatedAt > post.published.updatedAt,
  };
};
