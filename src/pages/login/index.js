import { getSessionUser } from "@/services/auth";
export { default } from "./login";
export const getServerSideProps = async (context) => {
  const { session, pat } = await getSessionUser(context);
  if (session) {
    if (pat)
      return {
        redirect: {
          destination: "/repo",
          permanent: false,
        },
      };
    else
      return {
        redirect: {
          destination: "/no-pat",
          permanent: false,
        },
      };
  }
  return {
    props: {},
  };
};
