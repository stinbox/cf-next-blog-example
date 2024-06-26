import { database } from "@/database";
import { blogPosts, users } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";

export const deleteBlogPost = async (id: string): Promise<BlogPost> => {
  const deleted = await database()
    .delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning()
    .get();

  if (deleted == null) {
    throw new Error("Blog post not found");
  }

  const createdBy = await database().query.users.findFirst({
    where: eq(users.id, deleted.createdBy),
    columns: { id: true, name: true, image: true },
  });

  if (createdBy == null) {
    throw new Error("User not found");
  }

  return {
    id: deleted.id,
    title: deleted.title,
    content: deleted.content,
    createdAt: deleted.createdAt.toISOString(),
    updatedAt: deleted.updatedAt.toISOString(),
    createdBy: {
      id: createdBy.id,
      name: createdBy.name,
      image: createdBy.image,
    },
  };
};
