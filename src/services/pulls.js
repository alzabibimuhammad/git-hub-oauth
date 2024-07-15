import PullsRepository from "@/repositories/pulls";

class PullRequestService {
  constructor(githubServices) {
    this.githubServices = githubServices;
    this.pullsRepository = new PullsRepository();
  }

  async fetchAndSavePullRequests(repoName, accessToken) {
    const pullRequests = await this.fetchPullRequests(repoName, accessToken);
    if (!Array.isArray(pullRequests) || !pullRequests?.length) {
      console.error(
        `Expected an array of pull requests, but got:`,
        pullRequests
      );
      return [];
    }
    const savedPullRequests = await this.savePulls(pullRequests, repoName);
    return savedPullRequests;
  }

  async fetchPullRequests(repoName, accessToken) {
    return await this.githubServices.getPulls(repoName, accessToken);
  }

  async savePulls(pulls, repoName) {
    return await this.pullsRepository.store(pulls, repoName);
  }

  async getPulls() {
    return await this.pullsRepository.getPulls();
  }

  getRepoPulls(repo) {
    return this.pullsRepository.getRepoPulls(repo);
  }
  async updatePullRequestDevelopmentTime(
    repoName,
    prNumber,
    developmentTimeSeconds
  ) {
    return await this.pullsRepository.updatePullRequestDevelopmentTime(
      repoName,
      prNumber,
      developmentTimeSeconds
    );
  }

  getUniqueRepo() {
    return this.pullsRepository.getUniqueRepo();
  }
}

export default PullRequestService;
