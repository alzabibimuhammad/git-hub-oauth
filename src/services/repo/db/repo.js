import { prisma } from "@/hooks/prisma";
import chunkArray from "@/utils/chunk";

export async function getUserRepositories(username) {
  const repo = await prisma.repository.findMany({
    where: {
      userName: username,
    },
  });

  return repo.map((r) => ({
    ...r,
    createdAtRepo: r.createdAtRepo.toISOString(),
    createdAtDB: r.createdAtDB.toISOString(),
  }));
}

const CHUNK_SIZE = 20;
export async function upsertRepositories(repos) {
  const repoChunks = chunkArray(repos, CHUNK_SIZE);

  for (const chunk of repoChunks) {
    const upsertPromises = [];

    for (const r of chunk) {
      upsertPromises.push(
        prisma.repository.upsert({
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
    }

    await Promise.all(upsertPromises);
  }
}
