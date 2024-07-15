export class RepoInfra {
  id;
  name;
  createdAtRepo;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.createdAtRepo = data.createdAtRepo;
  }
}
