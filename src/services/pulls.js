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

  fetchPullRequests(repoName, accessToken) {
    return this.githubServices.getPulls(repoName, accessToken);
  }

  savePulls(pulls, repoName) {
    return this.pullsRepository.store(pulls, repoName);
  }

  getPulls() {
    return this.pullsRepository.getPulls();
  }

  getRepoPulls(repo) {
    return this.pullsRepository.getRepoPulls(repo);
  }
  updatePullRequestDevelopmentTime(repoName, prNumber, developmentTimeSeconds) {
    return this.pullsRepository.updatePullRequestDevelopmentTime(
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
