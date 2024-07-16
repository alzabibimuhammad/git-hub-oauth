import { getSession } from "next-auth/react";

export async function getSessionUser(context) {
  const session = await getSession(context);

  if (!session) {
    return { session: null, pat: null };
  } else {
    if (!session?.user?.pat) return { session: session, pat: null };
    else return { session: session, pat: session.user.pat };
  }
}
