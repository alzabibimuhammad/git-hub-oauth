import { prisma } from "@/hooks/prisma";

class UserRepository {
  prisma = prisma;
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }
  store() {
    return prisma.user.create({
      data: {
        id: this.id,
        userName: this.username,
      },
    });
  }

  get() {
    return prisma.user.findUnique({
      where: {
        userName: this.username,
      },
    });
  }
}
export default UserRepository;
