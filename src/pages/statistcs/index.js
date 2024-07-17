import { getSessionUser } from "../../services/auth.mjs";
import PullRequestService from "../../services/pulls.mjs";

export { default } from "./statistcs";

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
    const pullServices = new PullRequestService();
    const data = await pullServices.getRepoPulls(session.user.username);
    const repos = await pullServices.getUniqueRepo(session.user.username);
    return {
      props: {
        data: data,
        repos: repos,
        username: session.user.username,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
