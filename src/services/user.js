import UserRepository from "@/repositories/user";

class UserService {
  constructor(id, username) {
    this.userRepo = new UserRepository(id, username);
  }

  store() {
    return this.userRepo.store();
  }
  get() {
    return this.userRepo.get();
  }
}
export default UserService;
