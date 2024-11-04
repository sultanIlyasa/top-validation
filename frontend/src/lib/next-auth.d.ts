import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend User type in next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "COMPANY" | "ANALYST";
      firstName: string;
      lastName: string;
    };
    backendTokens: {
      access_token: string;
      refresh_token: string;
      expiresIn: number;
    };
  }
}

// Extend JWT type in next-auth/jwt
declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "COMPANY" | "ANALYST";
      firstName: string;
      lastName: string;
    };
    backendTokens: {
      access_token: string;
      refresh_token: string;
      expiresIn: number;
    };
  }
}
