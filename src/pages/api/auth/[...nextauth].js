// import UserService from "@/services/user";
// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";

// export const authOptions = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,

//       authorization: {
//         params: {
//           scope: ["repo", "repo:status", "read:repo_hook", "public_repo"].join(
//             " "
//           ),
//         },
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async jwt({ token, account, profile }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.id = profile?.id;
//         token.username = profile.login;
//         const userService = new UserService(profile.id, profile.login);

//         const existingUser = await userService.get();
//         if (!existingUser) {
//           await userService.store();
//         }
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.user.id = token.id;
//       session.user.username = token.username;
//       return session;
//     },
//   },
//   debug: true,
// };

// export default NextAuth(authOptions);

import UserService from "../../../services/user.mjs";
import NextAuth from "next-auth";
import { Issuer } from "openid-client";
import GoogleProvider from "next-auth/providers/google";

Issuer.defaultHttpOptions = { timeout: 10000 }; // 10 seconds timeout

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,

      authorization: {
        params: {
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
          ].join(" "),
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub;
        token.username = profile.name;
        token.email = profile.email;

        const userService = new UserService(profile.sub, profile.email, null);

        const existingUser = await userService.getById();
        if (!existingUser) {
          await userService.store();
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;

      const userService = new UserService(token.id, null, null);
      const user = await userService.getById();

      session.user.username = user ? user.userName : null;
      session.user.pat = user ? user.pat : null;
      return session;
    },
  },
  debug: true,
};

export default NextAuth(authOptions);
