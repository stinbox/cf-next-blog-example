"use client";

import { useEffect, useState } from "react";
import { apiClient } from "./hono-client";
import { useSession } from "next-auth/react";

export const Test: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const session = useSession();

  useEffect(() => {
    apiClient.api["blog-posts"][":id"]
      .$get({ param: { id: "hoge-fuga" } })
      .then((res) => res.json())
      .then(setState);
  }, []);

  return (
    <pre>
      {JSON.stringify(
        {
          state,
          sessionWithReact: session,
        },
        null,
        2
      )}
    </pre>
  );
};
