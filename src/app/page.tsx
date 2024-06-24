import { auth, signIn } from "@/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button>Signin with Google</button>
        </form>
      )}
    </main>
  );
}
