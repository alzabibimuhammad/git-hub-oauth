import CommitsRepository from "../repositories/commits.mjs";

class CommitService {
  constructor(pullsServices, githupServices) {
    this.pullsServices = pullsServices;
    this.githupServices = githupServices;
    this.commitsRepository = new CommitsRepository();
  }

  async fetchAndSaveCommits(pullRequestsFromGitHub, accessToken) {
    let page = 1;
    for (const pr of pullRequestsFromGitHub) {
      while (true) {
        const commits = await this.fetchCommits(
          pr.commits_url,
          accessToken,
          pr.number,
          page
        );

        await this.upsertCommits(commits, pr.number, pr.repo_name);

        if (commits?.length !== 100) break;
        page++;
      }
      try {
        const commits_from_db = await this.getCommitsForPulls(
          pr.number,
          pr.repo_name
        );

        const developmentTimeSeconds = this.calculateDevelopmentTime(
          commits_from_db,
          pr.merged_at
        );
        await this.pullsServices.updatePullRequestDevelopmentTime(
          pr.repo_name,
          pr.number,
          developmentTimeSeconds
        );
      } catch {}
    }
    return;
  }

  async fetchCommits(commitsUrl, accessToken, prNumber, page) {
    return await this.githupServices.fetchCommits(
      commitsUrl,
      accessToken,
      prNumber,
      page
    );
  }

  calculateDevelopmentTime(commits, mergedAt) {
    const oldestCommit = commits.reduce((oldest, commit) => {
      if (!oldest || new Date(commit.date) < new Date(oldest.date)) {
        return commit;
      }
      return oldest;
    }, null);

    return oldestCommit && mergedAt
      ? (new Date(mergedAt).getTime() - new Date(oldestCommit.date).getTime()) /
          1000
      : null;
  }

  upsertCommits(commits, prNumber, repoName) {
    return this.commitsRepository.upsertCommits(commits, prNumber, repoName);
  }

  getCommits() {
    return this.commitsRepository.getCommits();
  }

  getCommitsForPulls(prNumber, repoName) {
    return this.commitsRepository.getCommitsForPulls(prNumber, repoName);
  }
}

export default CommitService;
