"use client";

import { FilePlusIcon } from "lucide-react";
import { Session } from "next-auth";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/hono-client";

export const CreateNewButton: React.FC = () => {
  const router = useRouter();
  const [, action, isSubmitting] = useActionState(async () => {
    const response = await apiClient.api["blog-posts"].$post({
      json: {
        content: "",
        title: "",
        published: false,
      },
    });

    const created = await response.json();

    router.push(`/dashboard/edit/${created.id}`);
  }, null);

  return (
    <button
      type="button"
      className="rounded-full h-12 font-bold border-2 border-neutral-700 inline-flex items-center gap-3 shadow-xl bg-white hover:bg-neutral-100 px-6"
      disabled={isSubmitting}
      onClick={action}
    >
      Create New
      <FilePlusIcon />
    </button>
  );
};
