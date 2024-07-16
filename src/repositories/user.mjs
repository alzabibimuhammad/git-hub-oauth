import { prisma } from "../hooks/prisma.mjs";

class UserRepository {
  prisma = prisma;
  constructor(id, email, username) {
    this.id = id;
    this.email = email;
    this.username = username;
  }
  store() {
    return prisma.user.create({
      data: {
        id: this.id,
        userName: this.username,
        email: this.email,
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
  getById() {
    return prisma.user.findUnique({
      where: {
        id: this.id,
      },
    });
  }
  getAll() {
    return prisma.user.findMany();
  }
}
export default UserRepository;
