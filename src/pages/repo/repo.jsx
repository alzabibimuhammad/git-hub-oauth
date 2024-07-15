import RepoComponent from "@/components/pages/repo";

const UserPage = ({ initialRepo, pat }) => {
  return <RepoComponent initialRepo={initialRepo} pat={pat} />;
};
export default UserPage;
