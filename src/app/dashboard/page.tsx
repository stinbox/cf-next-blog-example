import { auth } from "@/auth";
import { notFound } from "next/navigation";

const Page: React.FC = async () => {
  const session = await auth();

  if (!session) {
    return notFound();
  }

  return <div></div>;
};

export default Page;
