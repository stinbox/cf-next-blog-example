import { getBlogPosts } from "@/features/blog-posts/get-blog-posts";
import { BlogPost } from "@/models/blog-post";
import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";

const Home: React.FC = async () => {
  const blogPosts = await getBlogPosts({
    createdBy: undefined,
    limit: 48,
    page: 0,
  });

  return (
    <main>
      <ul className="grid grid-cols-auto-fill-72 gap-6">
        {blogPosts.items.map((blogPost) => (
          <li key={blogPost.id} className="contents">
            <BlogPostCard key={blogPost.id} blogPost={blogPost} />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;

const BlogPostCard: React.FC<{ blogPost: BlogPost }> = ({ blogPost }) => {
  return (
    <article className="grid bg-white grid-rows-subgrid rounded-3xl border-2 relative border-neutral-700 py-4 px-6 row-span-2 gap-4">
      <h3 className="font-bold text-xl">
        <Link
          href={`/blog-posts/${blogPost.id}`}
          className="hover:underline before:absolute before:inset-0"
        >
          {blogPost.title ? (
            blogPost.title
          ) : (
            <span className="text-neutral-500">(無題の記事)</span>
          )}
        </Link>
      </h3>
      <div className="flex items-center gap-1">
        {blogPost.createdBy.image ? (
          <img
            className="object-fit rounded-full size-7"
            src={blogPost.createdBy.image}
            alt=""
          />
        ) : (
          <CircleUserRoundIcon className="size-7" />
        )}
        <p className="text-sm text-neutral-500">{blogPost.createdBy.name}</p>
      </div>
    </article>
  );
};
