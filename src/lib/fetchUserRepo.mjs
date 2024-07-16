import GitHubServices from "../services/githup.mjs";
import UserService from "../services/user.mjs";
import PullRequestService from "../services/pulls.mjs";
import CommitService from "../services/commits.mjs";
import RepoService from "../services/repositories.mjs";

export async function fetchUserRepos() {
  console.log("");
  console.log("######################################");
  console.log("#                                    #");
  console.log("# Running scheduler every  minutes #");
  console.log("#                                    #");
  console.log("######################################");
  console.log("");

  const usersService = new UserService();
  const users = await usersService.getAll();
  for (const user of users) {
    if (!user?.pat || !user.userName) continue;
    const githubService = new GitHubServices();
    const pullRequestService = new PullRequestService(githubService);
    const commitService = new CommitService(pullRequestService, githubService);
    const repoServices = new RepoService(
      user?.pat,
      user?.userName,
      pullRequestService,
      commitService,
      githubService
    );

    await repoServices.run();
  }
}
