import CommitService from "../../../services/commits.mjs";
import GitHubServices from "../../../services/githup.mjs";
import PullRequestService from "../../../services/pulls.mjs";
import RepoService from "../../../services/repositories.mjs";

const handler = async (req, res) => {
  const { username, pat } = req.body;
  try {
    const githubService = new GitHubServices();
    const pullRequestService = new PullRequestService(githubService);
    const commitService = new CommitService(pullRequestService, githubService);

    const repoServices = new RepoService(
      pat,
      username,
      pullRequestService,
      commitService,
      githubService
    );

    const result = await repoServices.run();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
