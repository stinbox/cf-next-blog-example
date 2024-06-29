import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { CreateNewButton } from "./create-new-button";
import { getBlogPosts } from "@/features/blog-posts/get-blog-posts";
import { BlogPostItem } from "./blog-post-item";
import * as v from "valibot";

const searchParamsSchema = v.object({
  page: v.optional(v.pipe(v.unknown(), v.transform(Number), v.integer())),
});

const Page: React.FC<{ searchParams: unknown }> = async ({ searchParams }) => {
  const session = await auth();

  if (!session) {
    return notFound();
  }

  const parsedParams = v.safeParse(searchParamsSchema, searchParams);

  if (!parsedParams.success) {
    return notFound();
  }

  if (parsedParams.output.page != null && parsedParams.output.page < 1) {
    return notFound();
  }

  const posts = await getBlogPosts({
    createdBy: session.user.id,
    page: parsedParams.output.page ?? 1,
    limit: 20,
    withDrafts: true,
  });

  if (posts.items.length === 0 && posts.page > 1) {
    return notFound();
  }

  return (
    <div className="pt-24">
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hover:scale-110 transition-transform">
        <CreateNewButton />
      </div>
      <ul className="border-y-2 border-neutral-700 divide-y-2 divide-neutral-700">
        {posts.items.map((post) => (
          <li key={post.id}>
            <BlogPostItem blogPost={post} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
