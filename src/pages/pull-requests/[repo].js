import { getSession } from "next-auth/react";
import PullRequestService from "@/services/pulls";
import PullsComponent from "@/components/pages/pulls";

const PullRequestsPage = ({ data, error }) => {
  return <PullsComponent data={data} error={error} />;
};

export const getServerSideProps = async (context) => {
  const { repo } = context.params;
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const pullServices = new PullRequestService();
    const data = await pullServices.getRepoPulls(repo);
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
