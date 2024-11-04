import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { Backend_URL } from "@/lib/Constants";
import { access } from "fs";

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000" + "/auth/refresh",
    {
      method: "POST",
      headers: {
        authorization: `Refresh ${token.backendTokens.refresh_token}`,
      },
    }
  );
  console.log("refreshed");

  const response = await res.json();
  return {
    ...token,
    backendTokens: {
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      expiresIn: response.expiresIn,
    },
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        const res = await fetch(Backend_URL + "/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          console.log(res.statusText);
          return null;
        }
        const user = await res.json();
        return {
          ...user,
          backendTokens: {
            access_token: user.backendTokens.access_token,
            backend_token: user.backendTokens.refresh_token,
            expiresIn: user.backendTokens.expiresIn,
          },
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log({ token, user });
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.backendTokens.expiresIn) return token; // Token still valid

      return token;
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
