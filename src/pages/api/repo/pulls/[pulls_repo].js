// pages/api/repo/pulls/[pulls_repo].js
import { fetchAndSaveCommits } from "@/hooks/commitsApi";
import { prisma } from "@/hooks/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { pulls_repo } = req.query;

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${session.user.username}/${pulls_repo}/pulls?state=closed`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error:
          errorData?.message || "An error occurred fetching pull requests.",
      });
    }

    const pullRequestsFromGitHub = await response.json();

    try {
      await fetchAndSaveCommits(
        pullRequestsFromGitHub,
        session.accessToken,
        pulls_repo
      );
    } catch (error) {
      console.error("Error in fetchAndSaveCommits:", error);
    }

    const pullRequests = await prisma.pulls.findMany({
      where: {
        repo_name: pulls_repo,
      },
      include: {
        commits: true,
        repository: true,
      },
    });

    const serializablePullRequests = pullRequests.map((pr) => ({
      ...pr,
      merged_at: pr.merged_at ? pr.merged_at.toISOString() : null,
      createdAtDB: pr.createdAtDB.toISOString(),
      commits: pr.commits.map((commit) => ({
        ...commit,
        date: commit.date.toISOString(),
        createdAtDB: commit.createdAtDB.toISOString(),
      })),
    }));

    return res.status(200).json({ pullRequests: serializablePullRequests });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
