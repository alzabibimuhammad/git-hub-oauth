import PullRequestService from "../../../../services/pulls.mjs";

const handler = async (req, res) => {
  const { repo } = req.query;
  const { username } = req.body;

  const repoPath = Array.isArray(repo) ? repo.join("/") : repo;

  try {
    const pullRequestService = new PullRequestService();
    const data = await pullRequestService.getRepoPulls(
      username,
      repoPath ? repoPath : null
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
