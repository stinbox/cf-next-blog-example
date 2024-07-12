import { getBlogPost } from "@/features/blog-posts/get-blog-post";
import { ImageResponse } from "next/og";

export default async ({
  params: { blogPostId },
}: {
  params: { blogPostId: string };
}) => {
  const blogPost = await getBlogPost(blogPostId);

  if (!blogPost) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          backgroundColor: "lightblue",
          color: "darkblue",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 48,
          fontWeight: 900,
        }}
      >
        {blogPost.title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};
