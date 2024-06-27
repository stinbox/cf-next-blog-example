import { auth, signIn, signOut } from "@/auth";
import { Test } from "./test";

const Home: React.FC = async () => {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session ? (
        <div>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button>Sign Out</button>
          </form>
        </div>
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
      <Test />
    </main>
  );
};

export default Home;
