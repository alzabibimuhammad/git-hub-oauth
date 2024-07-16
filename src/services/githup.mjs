class GitHubServices {
  constructor() {}
  async getRepositories(token, username) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "An error occurred fetching user data."
      );
    }

    return response.json();
  }

  async getPulls(repoName, token) {
    const response = await fetch(
      `https://api.github.com/repos/${repoName}/pulls?state=closed&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "An error occurred fetching pull requests."
      );
    }

    return response.json();
  }

  async fetchCommits(commitsUrl, accessToken, prNumber) {
    try {
      const commitsResponse = await fetch(commitsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!commitsResponse.ok) {
        throw new Error(
          `Failed to fetch commits for PR #${prNumber}: ${commitsResponse.statusText}`
        );
      }

      return await commitsResponse.json();
    } catch (error) {
      console.error(`Failed to fetch commits for PR #${prNumber}:`, error);
      return [];
    }
  }
}

export default GitHubServices;
