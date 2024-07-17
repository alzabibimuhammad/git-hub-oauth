import { prisma } from "../hooks/prisma.mjs";
import { PromisePool } from "@supercharge/promise-pool";

class CommitsRepository {
  prisma = prisma;
  async upsertCommits(commits, prNumber, repoName) {
    await PromisePool.for(commits)
      .withConcurrency(5)
      .process(async (commit) => {
        await this.prisma.commits.upsert({
          where: {
            sha_pullsNumber_repo_name: {
              sha: commit.sha,
              pullsNumber: prNumber,
              repo_name: repoName,
            },
          },
          update: {
            date: new Date(commit.commit.author.date),
          },
          create: {
            sha: commit.sha,
            pullsNumber: prNumber,
            repo_name: repoName,
            date: new Date(commit.commit.author.date),
          },
        });
      });
  }

  getCommits() {
    return this.prisma.commits.findMany();
  }
  getCommitsForPulls(prNumber, repoName) {
    return prisma.commits.findMany({
      where: {
        pullsNumber: prNumber,
        repo_name: repoName,
      },
    });
  }
}
export default CommitsRepository;
