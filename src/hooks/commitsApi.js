import { prisma } from "./prisma";

export async function fetchAndSaveCommits(
  pullRequestsFromGitHub,
  accessToken,
  repoName
) {
  try {
    for (const pr of pullRequestsFromGitHub) {
      try {
        await prisma.pulls.upsert({
          where: {
            repo_name_number: { repo_name: repoName, number: pr.number },
          },
          update: {
            title: pr.title,
            state: pr.state,
            commits_url: pr.commits_url,
            merged_at: pr.merged_at,
            repo_name: repoName,
          },
          create: {
            number: pr.number,
            title: pr.title,
            state: pr.state,
            commits_url: pr.commits_url,
            merged_at: pr.merged_at,
            repo_name: repoName,
          },
        });
      } catch (error) {
        console.error(`Failed to upsert pull request #${pr.number}:`, error);
        continue;
      }

      let commits;
      try {
        const commitsResponse = await fetch(pr.commits_url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!commitsResponse.ok) {
          throw new Error(
            `Failed to fetch commits for PR #${pr.number}: ${commitsResponse.statusText}`
          );
        }

        commits = await commitsResponse.json();
      } catch (error) {
        console.error(`Failed to fetch commits for PR #${pr.number}:`, error);
        continue;
      }

      const oldestCommit = commits.reduce((oldest, commit) => {
        if (
          !oldest ||
          new Date(commit.commit.author.date) <
            new Date(oldest.commit.author.date)
        ) {
          return commit;
        }
        return oldest;
      }, null);

      const developmentTimeSeconds =
        oldestCommit && pr.merged_at
          ? (new Date(pr.merged_at).getTime() -
              new Date(oldestCommit.commit.author.date).getTime()) /
            1000
          : null;

      for (const commit of commits) {
        try {
          await prisma.commits.upsert({
            where: {
              sha_pullsNumber_repo_name: {
                sha: commit.sha,
                pullsNumber: pr.number,
                repo_name: repoName,
              },
            },
            update: {
              date: new Date(commit.commit.author.date),
            },
            create: {
              sha: commit.sha,
              pullsNumber: pr.number,
              repo_name: repoName,
              date: new Date(commit.commit.author.date),
            },
          });
        } catch (error) {
          console.error(`Failed to upsert commit ${commit.sha}:`, error);
        }
      }

      try {
        await prisma.pulls.update({
          where: {
            repo_name_number: { repo_name: repoName, number: pr.number },
          },
          data: {
            developmentTimeSeconds: developmentTimeSeconds,
          },
        });
      } catch (error) {
        console.error(
          `Failed to update developmentTimeSeconds for PR #${pr.number}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in fetchAndSaveCommits:", error);
    throw new Error("Failed to fetch and save commits.");
  }
}
