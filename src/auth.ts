import NextAuth from "next-auth";
import google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { database } from "./database";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "./database-schema";

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  return {
    providers: [google],
    adapter: DrizzleAdapter(database(), {
      accountsTable: accounts,
      sessionsTable: sessions,
      usersTable: users,
      verificationTokensTable: verificationTokens,
      authenticatorsTable: authenticators,
    }),
  };
});
