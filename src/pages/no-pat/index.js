import { getSessionUser } from "@/services/auth";
export { default } from "./noPat";

export const getServerSideProps = async (context) => {
  const { session, pat } = await getSessionUser(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    if (pat && session.user.username)
      return {
        redirect: {
          destination: "/repo",
          permanent: false,
        },
      };
  }
  return {
    props: {
      id: session.user.id,
    },
  };
};
