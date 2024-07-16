import { prisma } from "../hooks/prisma.mjs";

class PatRepository {
  prisma = prisma;
  constructor(id, pat, username) {
    this.id = id;
    this.pat = pat;
    this.username = username;
  }
  update() {
    return prisma.user.update({
      where: {
        id: this.id,
      },
      data: {
        userName: this.username,
        pat: this.pat,
      },
    });
  }

  get() {
    return prisma.user.findUnique({
      where: {
        userName: this.username,
      },

      select: { pat: true, userName: true },
    });
  }
}
export default PatRepository;
