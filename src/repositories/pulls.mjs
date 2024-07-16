import { prisma } from "../hooks/prisma.mjs";
import { PromisePool } from "@supercharge/promise-pool";

class PullsRepository {
  prisma = prisma;

  async store(pulls, repoName) {
    const repoShortName = repoName.split("/")[1];

    await PromisePool.for(pulls)
      .withConcurrency(5)
      .process(async (pr) => {
        if (!pr) {
          console.error(
            `Invalid pull request data for repo ${repoShortName}:`,
            pr
          );
          return;
        }
        try {
          await this.prisma.pulls.upsert({
            where: {
              repo_name_number: {
                repo_name: repoShortName,
                number: pr.number,
              },
            },
            update: {
              title: pr.title,
              state: pr.state,
              commits_url: pr.commits_url,
              merged_at: pr.merged_at,
              repo_name: repoShortName,
            },
            create: {
              number: pr.number,
              title: pr.title,
              state: pr.state,
              commits_url: pr.commits_url,
              merged_at: pr.merged_at,
              repo_name: repoShortName,
            },
          });
        } catch (error) {
          console.error(
            `Failed to upsert pull request #${pr.number} for repo ${repoShortName}:`,
            error
          );
        }
      });
  }

  async getPulls() {
    const data = await this.prisma.pulls.findMany({
      include: {
        commits: true,
      },
    });
    const serializablePullRequests = data.map((pr) => {
      return {
        ...pr,
        merged_at: pr.merged_at ? pr.merged_at.toISOString() : null,
        createdAtDB: pr.createdAtDB.toISOString(),
        commits: pr.commits.map((commit) => ({
          ...commit,
          date: commit.date.toISOString(),
          createdAtDB: commit.createdAtDB.toISOString(),
        })),
      };
    });
    return serializablePullRequests;
  }

  async updatePullRequestDevelopmentTime(
    repoName,
    prNumber,
    developmentTimeSeconds
  ) {
    try {
      await this.prisma.pulls.update({
        where: {
          repo_name_number: { repo_name: repoName, number: prNumber },
        },
        data: {
          developmentTimeSeconds: developmentTimeSeconds,
        },
      });
    } catch (error) {
      console.error(
        `Failed to update developmentTimeSeconds for PR #${prNumber}:`,
        error
      );
    }
  }

  async getRepoPulls(repo) {
    let data = [];
    if (repo) {
      data = await this.prisma.pulls.findMany({
        where: {
          repo_name: repo,
        },
        include: {
          commits: true,
        },
      });
    } else {
      data = await this.prisma.pulls.findMany({
        include: {
          commits: true,
        },
      });
    }
    const serializablePullRequests = data.map((pr) => {
      return {
        ...pr,
        merged_at: pr.merged_at ? pr.merged_at.toISOString() : null,
        createdAtDB: pr.createdAtDB.toISOString(),
        commits: pr.commits.map((commit) => ({
          ...commit,
          date: commit.date.toISOString(),
          createdAtDB: commit.createdAtDB.toISOString(),
        })),
      };
    });
    return serializablePullRequests;
  }

  getUniqueRepo() {
    const uniqueRepos = this.prisma.pulls.findMany({
      distinct: ["repo_name"],
      select: {
        repo_name: true,
      },
    });

    return uniqueRepos;
  }
}

export default PullsRepository;
