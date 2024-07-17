import PullRequestService from "@/services/pulls.mjs";
import PullsComponent from "@/components/pages/pulls";
import { getSessionUser } from "@/services/auth";

const PullRequestsPage = ({ data, error }) => {
  return <PullsComponent data={data} error={error} />;
};

export const getServerSideProps = async (context) => {
  const { repo } = context.params;
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

  try {
    const pullServices = new PullRequestService();
    const data = await pullServices.getRepoPulls(session.user.username, repo);
    return {
      props: {
        data: data,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};

export default PullRequestsPage;
