import StatisticsComponent from "@/components/pages/statistics";

export default function Statistcs({ data, repos, username }) {
  return (
    <>
      <StatisticsComponent data={data} repos={repos} username={username} />
    </>
  );
}
