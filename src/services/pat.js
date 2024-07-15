import PatRepository from "@/repositories/pat";

class PatService {
  constructor(pat, username) {
    this.patRepo = new PatRepository(pat, username);
  }

  store() {
    return this.patRepo.store();
  }
  get() {
    return this.patRepo.get();
  }
}
export default PatService;
