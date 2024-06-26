"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export const Providers: React.FC<{
  children: React.ReactNode;
  session: Session | null;
}> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
