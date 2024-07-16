import { getSessionUser } from "../../services/auth.mjs";
import RepoService from "../../services/repositories.mjs";

export { default } from "./repo";

export const getServerSideProps = async (context) => {
  try {
    const { session, pat } = await getSessionUser(context);

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    } else {
      if (!pat)
        return {
          redirect: {
            destination: "/no-pat",
            permanent: false,
          },
        };
    }

    const repoService = new RepoService(
      session.accessToken,
      session.user.username
    );
    const repo = await repoService.getUserRepositories();
    return {
      props: {
        repo: repo,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
