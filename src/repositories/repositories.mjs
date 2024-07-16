import { prisma } from "../hooks/prisma.mjs";
import { PromisePool } from "@supercharge/promise-pool";

class RepoRepositories {
  prisma = prisma;
  constructor(userName) {
    this.userName = userName;
  }

  async getRepoFromDb() {
    try {
      const repo = await this.prisma.repository.findMany({
        where: {
          userName: this.userName,
        },
      });

      return repo?.map((r) => ({
        ...r,
        createdAtRepo: r.createdAtRepo.toISOString(),
        createdAtDB: r.createdAtDB.toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching repositories from DB:", error);
    }
  }

  async upsertRepositories(repos, concurrencyLimit) {
    try {
      await PromisePool.withConcurrency(concurrencyLimit)
        .for(repos)
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
