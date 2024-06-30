import { getBlogPost } from "@/features/blog-posts/get-blog-post";
import { EditBlogPost } from "./edit-blog-post";
import { notFound } from "next/navigation";

const Page: React.FC<{
  params: {
    blogPostId: string;
  };
}> = async ({ params }) => {
  const blogPost = await getBlogPost(params.blogPostId, { withDraft: true });

  if (!blogPost) {
    return notFound();
  }

  return (
    <div className="max-w-screen-md mx-auto">
      <EditBlogPost blogPost={blogPost} />
    </div>
  );
};

export default Page;
