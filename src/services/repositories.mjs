import { prisma } from "../hooks/prisma.mjs";
import RepoRepositories from "../repositories/repositories.mjs";

class RepoService {
  prisma = prisma;
  constructor(
    accessToken,
    username,
    pullRequestService,
    commitService,
    githubService
  ) {
    this.accessToken = accessToken;
    this.username = username;
    this.pullRequestService = pullRequestService;
    this.commitService = commitService;
    this.CHUNK_SIZE = 5;
    this.githubService = githubService;
    this.repoRepository = new RepoRepositories(username);
  }

  getUserRepositories() {
    return this.repoRepository.getRepoFromDb();
  }

  upsertRepositories(repos) {
    return this.repoRepository.upsertRepositories(repos, this.CHUNK_SIZE);
  }

  fetchUserRepos(page) {
    return this.githubService.getRepositories(
      this.accessToken,
      this.username,
      page
    );
  }

  async fetchAndSaveRepositories(page) {
    const repos = await this.fetchUserRepos(page);
    await this.upsertRepositories(repos);
    return;
  }

  async fetchPullRequestsForRepos(repos) {
    const allPullRequests = [];
    for (const repo of repos) {
      const pullRequests =
        await this.pullRequestService.fetchAndSavePullRequests(
          repo.userName + "/" + repo.name,
          this.accessToken
        );
      if (Array.isArray(pullRequests)) {
        allPullRequests.push(...pullRequests);
      } else {
        console.error(
          `Expected an array of pull requests, but got:`,
          pullRequests
        );
      }
    }

    return allPullRequests;
  }
  async fetchCommitsForPullRequests(pullRequests, accessToken) {
    for (const pr of pullRequests) {
      await this.commitService.fetchAndSaveCommits(
        [pr],
        accessToken,
        pr.base.repo.full_name
      );
    }
  }

  async run() {
    let page = 1;
    while (true) {
      const repos = await this.fetchAndSaveRepositories(page);
      if (repos?.length !== 100) break;
      page++;
    }
    const repo = await this.getUserRepositories();
    await this.fetchPullRequestsForRepos(repo, this.accessToken);
    const pulls = await this.pullRequestService.getRepoPulls(this.username);
    await this.commitService.fetchAndSaveCommits(pulls, this.accessToken);
    console.log("done");
    return pulls;
  }
}

export default RepoService;
