import PullsRepository from "../repositories/pulls.mjs";

class PullRequestService {
  constructor(githubServices) {
    this.githubServices = githubServices;
    this.pullsRepository = new PullsRepository();
  }

  async fetchAndSavePullRequests(repoName, accessToken) {
    let page = 1;
    while (true) {
      const pullRequests = await this.fetchPullRequests(
        repoName,
        accessToken,
        page
      );
      if (!Array.isArray(pullRequests) || !pullRequests?.length) {
        console.error(
          `Expected an array of pull requests, but got:`,
          pullRequests
        );
        return [];
      }
      await this.savePulls(pullRequests, repoName);

      if (pullRequests?.length !== 100) break;
      page++;
    }
    const savedPullRequests = this.getPulls(repoName?.split("/")[1]);
    return savedPullRequests;
  }

  fetchPullRequests(repoName, accessToken, page) {
    return this.githubServices.getPulls(repoName, accessToken, page);
  }

  savePulls(pulls, repoName) {
    return this.pullsRepository.store(pulls, repoName);
  }

  getPulls(repo) {
    return this.pullsRepository.getPulls(repo);
  }

  getRepoPulls(username, repo) {
    return this.pullsRepository.getRepoPulls(username, repo);
  }
  updatePullRequestDevelopmentTime(repoName, prNumber, developmentTimeSeconds) {
    return this.pullsRepository.updatePullRequestDevelopmentTime(
      repoName,
      prNumber,
      developmentTimeSeconds
    );
  }

  getUniqueRepo(username) {
    return this.pullsRepository.getUniqueRepo(username);
  }
}

export default PullRequestService;
