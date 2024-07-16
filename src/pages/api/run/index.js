import { prisma } from "@/hooks/prisma";
import CommitService from "@/services/commits";
import GitHubServices from "@/services/githup";
import PullRequestService from "@/services/pulls";
import RepoService from "@/services/repositories";

const handler = async (req, res) => {
  try {
    const githubService = new GitHubServices();
    const pullRequestService = new PullRequestService(githubService);
    const commitService = new CommitService(pullRequestService, githubService);

    const repoServices = new RepoService(
      "",
      "alzabibimuhammad",
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
