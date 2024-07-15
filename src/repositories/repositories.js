import { prisma } from "@/hooks/prisma";
import chunkArray from "@/utils/chunk";

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

  async upsertRepositories(repos, CHUNK_SIZE) {
    const repoChunks = chunkArray(repos, CHUNK_SIZE);

    try {
      for (const chunk of repoChunks) {
        const upsertPromises = chunk.map((r) =>
          this.prisma.repository.upsert({
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
          })
        );

        await Promise.all(upsertPromises);
      }
    } catch {}
  }
}
export default RepoRepositories;
