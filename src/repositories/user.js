import { prisma } from "@/hooks/prisma";

class UserRepository {
  prisma = prisma;
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }
  async store() {
    const user = await prisma.user.create({
      data: {
        id: this.id,
        userName: this.username,
      },
    });
    return user;
  }

  async get() {
    const user = await prisma.user.findUnique({
      where: {
        userName: this.username,
      },
    });
    return user;
  }
}
export default UserRepository;
