import { auth, signIn, signOut } from "@/auth";

const Home: React.FC = async () => {
  const session = await auth();

  return <main className=""></main>;
};

export default Home;
