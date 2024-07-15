import StatisticsComponent from "@/components/pages/statistics";

export default function Statistcs({ data, repos }) {
  return (
    <>
      <StatisticsComponent data={data} repos={repos} />
    </>
  );
}
