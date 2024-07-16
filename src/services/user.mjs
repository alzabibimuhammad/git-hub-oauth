import UserRepository from "../repositories/user.mjs";

class UserService {
  constructor(id, email, username) {
    this.userRepo = new UserRepository(id, email, username);
  }

  store() {
    return this.userRepo.store();
  }
  get() {
    return this.userRepo.get();
  }
  getById() {
    return this.userRepo.getById();
  }
  getAll() {
    return this.userRepo.getAll();
  }
}
export default UserService;
