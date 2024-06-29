import { database } from "@/database";
import { blogPosts, publishedBlogPosts, users } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { Pagination } from "@/models/pagination";
import { and, count, desc, eq, getTableColumns, sql } from "drizzle-orm";

type GetBlogPostParams = {
  createdBy?: string;
  page: number;
  limit: number;
  withDrafts?: boolean;
};

export const getBlogPosts = async ({
  createdBy,
  page,
  limit,
  withDrafts,
}: GetBlogPostParams): Promise<Pagination<BlogPost>> => {
  if (withDrafts) {
    const conditions = [eq(sql`1`, 1)];
    if (createdBy) {
      conditions.push(eq(blogPosts.createdBy, createdBy));
    }

    const [foundBlogPosts, [totalCount]] = await database().batch([
      database().query.blogPosts.findMany({
        where: and(...conditions),
        limit: limit + 1, // Fetch one more to check if there is a next page
        offset: (page - 1) * limit,
        orderBy: desc(blogPosts.createdAt),
        with: {
          user: { columns: { id: true, name: true, image: true } },
          published: true,
        },
      }),

      database()
        .select({
          totalCount: count(),
        })
        .from(blogPosts)
        .where(and(...conditions)),
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
        publishedAt: post.published?.publishedAt.toISOString() ?? null,
        isDraft:
          post.published == null || post.updatedAt > post.published.updatedAt,
      })),
      limit: limit,
      page: page,
      total: totalCount?.totalCount ?? 0,
      nextPage: foundBlogPosts.length > limit ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  } else {
    const conditions = [eq(sql`1`, 1)];
    if (createdBy) {
      conditions.push(eq(blogPosts.createdBy, createdBy));
    }

    const [foundPublishedBlogPosts, [totalCount]] = await database().batch([
      database()
        .select({
          ...getTableColumns(publishedBlogPosts),
          draft: {
            ...getTableColumns(blogPosts),
          },
          user: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(publishedBlogPosts)
        .innerJoin(blogPosts, eq(publishedBlogPosts.id, blogPosts.id))
        .innerJoin(users, eq(users.id, blogPosts.createdBy))
        .where(and(...conditions))
        .limit(limit + 1) // Fetch one more to check if there is a next page
        .offset((page - 1) * limit)
        .orderBy(desc(publishedBlogPosts.publishedAt)),

      database()
        .select({
          totalCount: count(),
        })
        .from(publishedBlogPosts)
        .innerJoin(blogPosts, eq(publishedBlogPosts.id, blogPosts.id))
        .where(and(...conditions)),
    ]);

    return {
      items: foundPublishedBlogPosts.slice(0, limit).map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.draft.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        createdBy: {
          id: post.user.id,
          name: post.user.name,
          image: post.user.image,
        },
        publishedAt: post.publishedAt.toISOString(),
        isDraft: false,
      })),
      limit: limit,
      page: page,
      total: totalCount?.totalCount ?? 0,
      nextPage: foundPublishedBlogPosts.length > limit ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }
};
