import { getBlogPost } from "@/features/blog-posts/get-blog-post";
import { notFound } from "next/navigation";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import classes from "./content.module.css";
import { format } from "date-fns";
import { CircleUserRoundIcon, PencilLineIcon } from "lucide-react";
import { Metadata } from "next";

type Props = {
  params: {
    blogPostId: string;
  };
};

const Page: React.FC<Props> = async ({ params }) => {
  const blogPost = await getBlogPost(params.blogPostId);

  if (!blogPost) {
    return notFound();
  }

  const contentHTML = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(blogPost.content);

  return (
    <main className="max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {blogPost.title || "(無題の記事)"}
      </h1>
      <div className="flex items-center gap-1 mb-4">
        {blogPost.createdBy.image ? (
          <img
            className="object-fit rounded-full size-6"
            src={blogPost.createdBy.image}
            alt=""
          />
        ) : (
          <CircleUserRoundIcon className="size-6" />
        )}
        <span className="text-sm font-bold text-neutral-500">
          {blogPost.createdBy.name}
        </span>
      </div>
      <div className="mb-4">
        {blogPost.publishedAt && (
          <p className="text-sm text-neutral-500">
            公開:{" "}
            <time dateTime={blogPost.publishedAt}>
              {format(blogPost.publishedAt, "yyyy/MM/dd HH:mm")}
            </time>
          </p>
        )}
        {blogPost.updatedAt !== blogPost.publishedAt && (
          <p className="text-sm text-neutral-500">
            更新:{" "}
            <time dateTime={blogPost.updatedAt}>
              {format(blogPost.updatedAt, "yyyy/MM/dd HH:mm")}
            </time>
          </p>
        )}
      </div>
      <hr className="mb-12 border-neutral-700 border-t-2" />
      <article
        className={classes.content}
        dangerouslySetInnerHTML={{
          __html: contentHTML.toString(),
        }}
      />
    </main>
  );
};

export default Page;

export const generateMetadata = async ({
  params: { blogPostId },
}: Props): Promise<Metadata> => {
  const blogPost = await getBlogPost(blogPostId);

  if (!blogPost) {
    return notFound();
  }

  return {
    title: blogPost.title,
    openGraph: {
      type: "article",
      title: blogPost.title,
    },
  };
};
