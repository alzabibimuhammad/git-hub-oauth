import PatRepository from "../repositories/pat.mjs";

class PatService {
  constructor(id, pat, username) {
    this.patRepo = new PatRepository(id, pat, username);
  }

  update() {
    return this.patRepo.update();
  }
  get() {
    return this.patRepo.get();
  }
}
export default PatService;
