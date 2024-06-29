import { BlogPost } from "@/models/blog-post";
import { CircleUserRoundIcon } from "lucide-react";

export const BlogPostCard: React.FC<{ blogPost: BlogPost }> = ({
  blogPost,
}) => {
  return (
    <article className="bg-white grid-rows-subgrid rounded-3xl border-2 border-neutral-700 p-4">
      <h2 className="font-bold text-xl">
        {blogPost.title ? blogPost.title : "(無題の記事)"}
      </h2>
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
