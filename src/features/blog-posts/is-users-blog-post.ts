import { database } from "@/database";
import { blogPosts } from "@/database-schema";
import { and, eq } from "drizzle-orm";

export const isUsersBlogPost = async (
  userId: string,
  blogPostId: string
): Promise<boolean> => {
  const found = await database().query.blogPosts.findFirst({
    where: and(eq(blogPosts.id, blogPostId), eq(blogPosts.createdBy, userId)),
    columns: { id: true },
  });

  return found != null;
};
