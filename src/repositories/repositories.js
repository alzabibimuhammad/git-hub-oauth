import { prisma } from "@/hooks/prisma";
import PromisePool from "@supercharge/promise-pool";

class RepoRepositories {
  prisma = prisma;
  constructor(userName) {
    this.userName = userName;
  }
  async getRepoFromDb() {
    try {
      const repo = await this.prisma.repository.findMany({
        where: {
          userName: this.username,
        },
      });

      return repo?.map((r) => ({
        ...r,
        createdAtRepo: r.createdAtRepo.toISOString(),
        createdAtDB: r.createdAtDB.toISOString(),
      }));
    } catch {}
  }

  async upsertRepositories(repos, concurrencyLimit) {
    try {
      await PromisePool.for(repos)
        .withConcurrency(concurrencyLimit)
        .process(async (r) => {
          await this.prisma.repository.upsert({
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
        });
    } catch (error) {
      console.error("Failed to upsert repositories:", error);
    }
  }
}
export default RepoRepositories;
