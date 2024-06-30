import { database } from "@/database";
import { blogPosts, publishedBlogPosts } from "@/database-schema";
import { BlogPost } from "@/models/blog-post";
import { eq } from "drizzle-orm";

type GetBlogPostParams = {
  withDraft: boolean;
};

export const getBlogPost = async (
  id: string,
  { withDraft }: GetBlogPostParams = { withDraft: false }
): Promise<BlogPost | null> => {
  if (withDraft) {
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
  } else {
    const post = await database().query.publishedBlogPosts.findFirst({
      where: eq(publishedBlogPosts.id, id),
      with: {
        draft: {
          columns: { createdAt: true, createdBy: true },
          with: {
            user: {
              columns: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    if (post == null) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.draft.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      createdBy: {
        id: post.draft.user.id,
        name: post.draft.user.name,
        image: post.draft.user.image,
      },
      publishedAt: post.publishedAt.toISOString(),
      isDraft: false,
    };
  }
};
