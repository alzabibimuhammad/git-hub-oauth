import CommitsRepository from "@/repositories/commits";

class CommitService {
  constructor(pullsServices, githupServices) {
    this.pullsServices = pullsServices;
    this.githupServices = githupServices;
    this.commitsRepository = new CommitsRepository();
  }

  async fetchAndSaveCommits(pullRequestsFromGitHub, accessToken) {
    for (const pr of pullRequestsFromGitHub) {
      const commits = await this.fetchCommits(
        pr.commits_url,
        accessToken,
        pr.number
      );
      const developmentTimeSeconds = this.calculateDevelopmentTime(
        commits,
        pr.merged_at
      );

      await this.upsertCommits(commits, pr.number, pr.repo_name);
      await this.pullsServices.updatePullRequestDevelopmentTime(
        pr.repo_name,
        pr.number,
        developmentTimeSeconds
      );
    }
    return;
  }

  async fetchCommits(commitsUrl, accessToken, prNumber) {
    return await this.githupServices.fetchCommits(
      commitsUrl,
      accessToken,
      prNumber
    );
  }

  calculateDevelopmentTime(commits, mergedAt) {
    const oldestCommit = commits.reduce((oldest, commit) => {
      if (
        !oldest ||
        new Date(commit.commit.author.date) <
          new Date(oldest.commit.author.date)
      ) {
        return commit;
      }
      return oldest;
    }, null);

    return oldestCommit && mergedAt
      ? (new Date(mergedAt).getTime() -
          new Date(oldestCommit.commit.author.date).getTime()) /
          1000
      : null;
  }

  upsertCommits(commits, prNumber, repoName) {
    return this.commitsRepository.upsertCommits(commits, prNumber, repoName);
  }

  getCommits() {
    return this.commitsRepository.getCommits();
  }
}

export default CommitService;
