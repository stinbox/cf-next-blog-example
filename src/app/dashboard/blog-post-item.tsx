import { BlogPost } from "@/models/blog-post";
import { EditIcon, PlayIcon } from "lucide-react";
import Link from "next/link";

export const BlogPostItem: React.FC<{
  blogPost: BlogPost;
}> = ({ blogPost }) => {
  return (
    <div className="py-2 justify-between px-3 gap-4">
      <p className="text-xxs text-neutral-500 break-words">{blogPost.id}</p>
      <div className=" grid grid-cols-[1fr_auto]">
        <div className="overflow-hidden">
          <p className="font-bold mt-1">
            {blogPost.title ? (
              blogPost.title
            ) : (
              <span className="text-neutral-500 break-words">(無題の記事)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-fit">
          <Link
            className="rounded-full bg-neutral-200 size-9 inline-grid place-items-center hover:bg-neutral-300"
            href={`/dashboard/${blogPost.id}`}
            aria-label="編集する"
          >
            <EditIcon className="size-5" />
          </Link>
          <Link
            className="rounded-full bg-neutral-200 size-9 inline-grid place-items-center hover:bg-neutral-300"
            href={`/blog-posts/${blogPost.id}`}
            aria-label="記事を見る"
          >
            <PlayIcon className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
