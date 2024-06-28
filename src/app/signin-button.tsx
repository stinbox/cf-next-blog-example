import { signIn } from "@/auth";

export const SignInButton: React.FC = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button className="text-sm bg-white shadow rounded-full border-2 border-neutral-700 w-fit px-4 py-2 font-bold hover:bg-neutral-100">
        Signin with Google
      </button>
    </form>
  );
};
