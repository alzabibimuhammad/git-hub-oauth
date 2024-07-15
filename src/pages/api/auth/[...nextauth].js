import { prisma } from "@/hooks/prisma";
import UserService from "@/services/user";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,

      authorization: {
        params: {
          scope: ["repo", "repo:status", "read:repo_hook", "public_repo"].join(
            " "
          ),
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id;
        token.username = profile.login;
        const userService = new UserService(profile.id, profile.login);

        const existingUser = await userService.get();
        if (!existingUser) {
          await userService.store();
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },
  debug: true,
};

export default NextAuth(authOptions);
