import { prisma } from "@/hooks/prisma";

class CommitsRepository {
  prisma = prisma;
  async upsertCommits(commits, prNumber, repoName) {
    for (const commit of commits) {
      try {
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
      } catch (error) {
        console.error(`Failed to upsert commit ${commit.sha}:`, error);
      }
    }
  }

  async getCommits() {
    return await this.prisma.commits.findMany();
  }
}
export default CommitsRepository;
