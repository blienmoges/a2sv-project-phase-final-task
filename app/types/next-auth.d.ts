// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in User type
   */
  interface User {
    id: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  /** 
   * Extends the built-in JWT type 
   */
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}