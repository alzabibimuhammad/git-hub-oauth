import { prisma } from "@/hooks/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${session.user.username}/repos`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({
          error: errorData?.message || "An error occurred fetching user data.",
        });
    }

    const repoFromGitHub = await response.json();

    await Promise.all(
      repoFromGitHub.map(async (r) => {
        await prisma.repository.upsert({
          where: { name: r.name },
          update: {
            userName: r.owner.login,
            createdAtRepo: new Date(r.created_at).toISOString(),
            repo_url: r.clone_url,
          },
          create: {
            name: r.name,
            userName: r.owner.login,
            createdAtRepo: new Date(r.created_at).toISOString(),
            repo_url: r.clone_url,
          },
        });
      })
    );

    const repo = await prisma.repository.findMany({
      where: {
        userName: session.user.username,
      },
    });

    const serializableRepo = repo.map((r) => ({
      ...r,
      createdAtRepo: r.createdAtRepo.toISOString(),
      createdAtDB: r.createdAtDB.toISOString(),
    }));

    return res.status(200).json({ repo: serializableRepo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
