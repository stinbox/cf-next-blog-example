import NextAuth from "next-auth";
import google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@cf-next-blog-example/backend/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const database = getRequestContext().env.BACKEND.database();

  return {
    providers: [google],
    adapter: {
      ...DrizzleAdapter(database(), {
        accountsTable: accounts,
        sessionsTable: sessions,
        usersTable: users,
        verificationTokensTable: verificationTokens,
      }),
      ｗ,
    },
  };
});
