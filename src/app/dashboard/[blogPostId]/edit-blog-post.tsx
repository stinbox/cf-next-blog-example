"use client";

import { BlogPost } from "@/models/blog-post";
import { useActionState, useState } from "react";
import { TextEditor } from "./text-editor";
import { apiClient } from "@/hono-client";
import { format } from "date-fns";

export const EditBlogPost: React.FC<{ blogPost: BlogPost }> = ({
  blogPost,
}) => {
  const [blogPostState, saveBlogPost, isSaving] = useActionState<
    BlogPost,
    "publish" | "draft"
  >(async (_, opration) => {
    const response = await apiClient.api["blog-posts"][":id"].$put({
      param: { id: blogPost.id },
      json: {
        title: title,
        content: content,
        operation: opration,
      },
    });
    return await response.json();
  }, blogPost);

  const [title, setTitle] = useState(blogPostState.title);
  const [content, setContent] = useState(blogPostState.content);

  return (
    <div>
      <input
        placeholder="タイトルを入力"
        aria-label="タイトルを入力"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 text-2xl font-bold border-b-2 transition-colors border-transparent focus:border-neutral-700 outline-none pb-1"
      />
      <div className="flex items-end flex-col gap-1 h-20">
        {!!blogPostState.publishedAt && (
          <p className="text-xs text-neutral-500">
            {format(blogPostState.publishedAt, "yyyy/MM/dd HH:mm")} 公開{" "}
            <span className="inline-block size-2 rounded-full bg-green-300" />
          </p>
        )}
        {!!blogPostState.publishedAt && blogPostState.isDraft && (
          <p className="text-xs text-neutral-500">
            下書きあり{" "}
            <span className="inline-block size-2 rounded-full bg-red-300" />
          </p>
        )}
      </div>
      <TextEditor initialText={content} onChange={setContent} />
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-4 w-max">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => saveBlogPost("draft")}
          className="bg-white shadow rounded-full disabled:opacity-70 border-2 border-neutral-700 w-full px-4 h-12 font-bold hover:bg-neutral-100"
        >
          下書き保存
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => saveBlogPost("publish")}
          className="shadow rounded-full disabled:opacity-70 bg-neutral-800 w-full px-4 h-12 font-bold hover:bg-neutral-700 text-white"
        >
          公開
        </button>
      </div>
    </div>
  );
};
