import { database } from "@/database";
import { blogPosts } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { Pagination } from "@/models/pagination";
import { and, count, desc, eq, sql } from "drizzle-orm";

type GetBlogPostParams = {
  createdBy?: string;
  page: number;
  limit: number;
};

export const getBlogPosts = async ({
  createdBy,
  page,
  limit,
}: GetBlogPostParams): Promise<Pagination<BlogPost>> => {
  const condition = createdBy
    ? eq(blogPosts.createdBy, createdBy)
    : eq(sql`1`, 1);

  const [foundBlogPosts, [{ totalCount }]] = await database().batch([
    database().query.blogPosts.findMany({
      where: condition,
      limit: limit + 1, // Fetch one more to check if there is a next page
      offset: (page - 1) * limit,
      orderBy: desc(blogPosts.createdAt),
      with: { user: { columns: { id: true, name: true, image: true } } },
    }),

    database()
      .select({
        totalCount: count(),
      })
      .from(blogPosts)
      .where(condition),
  ]);

  return {
    items: foundBlogPosts.slice(0, limit).map((post) => ({
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
      publishedAt: post.publishedAt?.toISOString() ?? null,
    })),
    limit: limit,
    page: page,
    total: totalCount,
    nextPage: foundBlogPosts.length > limit ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};
