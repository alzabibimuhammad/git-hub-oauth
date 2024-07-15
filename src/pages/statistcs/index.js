import { getSessionUser } from "@/services/auth";
import PullRequestService from "@/services/pulls";

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
    const data = await pullServices.getRepoPulls();
    const repos = await pullServices.getUniqueRepo();
    return {
      props: {
        data: data,
        repos: repos,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
