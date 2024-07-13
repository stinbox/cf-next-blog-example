import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { auth } from "@/auth";
import { SignInButton } from "./signin-button";
import { AccountMenu } from "./account-menu";
import { getRequestContext } from "@cloudflare/next-on-pages";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const generateMetadata = (): Metadata => {
  const { env } = getRequestContext();

  return {
    title: "Cloudflare Next.js Blog Example",
    description: "Cloudflare Next.js Blog Example",
    metadataBase: new URL("https://" + env.WEBSITE_DOMAIN),
  };
};

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await auth();

  return (
    <html lang="ja">
      <body className={`${inter.variable} text-neutral-800 font-sans`}>
        <Providers session={session}>
          <div className="fixed right-4 top-4 w-fit z-10">
            {session ? <AccountMenu session={session} /> : <SignInButton />}
          </div>
          <div className="px-4 py-24">{children}</div>
          <p className="text-xxs text-neutral-600 p-4">
            このサイトは実装例のため、予告なくクローズされる可能性があります。
          </p>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;

export const runtime = "edge";
