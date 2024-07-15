import UserRepository from "@/repositories/user";

class UserService {
  constructor(id, username) {
    this.userRepo = new UserRepository(id, username);
  }

  async store() {
    return await this.userRepo.store();
  }
  async get() {
    return await this.userRepo.get();
  }
}
export default UserService;
