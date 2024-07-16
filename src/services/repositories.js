import { prisma } from "@/hooks/prisma";
import RepoRepositories from "@/repositories/repositories";

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

  fetchUserRepos() {
    return this.githubService.getRepositories(this.accessToken, this.username);
  }

  async fetchAndSaveRepositories(username, accessToken) {
    const repos = await this.fetchUserRepos(username, accessToken);
    await this.upsertRepositories(repos);
    return repos;
  }

  async fetchPullRequestsForRepos(repos) {
    const allPullRequests = [];
    for (const repo of repos) {
      const pullRequests =
        await this.pullRequestService.fetchAndSavePullRequests(
          repo.full_name,
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
    const repos = await this.fetchAndSaveRepositories(
      this.username,
      this.accessToken
    );
    await this.fetchPullRequestsForRepos(repos, this.accessToken);
    const pulls = await this.pullRequestService.getPulls();
    await this.commitService.fetchAndSaveCommits(pulls, this.accessToken);
    return pulls;
  }
}

export default RepoService;
