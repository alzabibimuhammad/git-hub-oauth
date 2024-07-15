import { prisma } from "@/hooks/prisma";
import { getSession } from "next-auth/react";

export async function getSessionUser(context) {
  const session = await getSession(context);

  if (!session) {
    return { session: null, pat: null };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userName: session.user.username,
      },
      select: {
        pat: true,
        userName: true,
      },
    });

    if (!user || !user.userName) {
      await signOut({ callbackUrl: "/login" });
      return { session: null, pat: null };
    }

    return { session, pat: user.pat };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { session, pat: null };
  }
}
