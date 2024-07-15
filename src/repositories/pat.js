import { prisma } from "@/hooks/prisma";

class PatRepository {
  prisma = prisma;
  constructor(pat, username) {
    this.pat = pat;
    this.username = username;
  }
  store() {
    return prisma.user.update({
      where: {
        userName: this.username,
      },
      data: {
        pat: this.pat,
      },
    });
  }

  async get() {
    const pat = await prisma.user.findUnique({
      where: {
        userName: this.username,
      },

      select: { pat: true, userName: true },
    });
    return pat;
  }
}
export default PatRepository;
