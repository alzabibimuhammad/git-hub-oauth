import { Box, Typography } from "@mui/material";
import { format, startOfWeek } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DevTimeChart from "./comp/chart";

export default function PullsComponent({ data, error }) {
  const router = useRouter();
  const { repo } = router.query;
  const [weeklyData, setWeeklyData] = useState([]);

  const processWeeklyData = (pullRequests) => {
    const Data = {};

    pullRequests.forEach((pr) => {
      const mergedDate = new Date(pr.merged_at);
      const weekStart = startOfWeek(mergedDate);
      const weekStartStr = format(weekStart, "yyyy-MM-dd");

      if (!Data[weekStartStr]) {
        Data[weekStartStr] = {
          totalDevTime: 0,
          count: 0,
        };
      }

      Data[weekStartStr].totalDevTime += pr.developmentTimeSeconds;
      Data[weekStartStr].count += 1;
    });

    const formattedData = Object.keys(Data).map((week) => ({
      week,
      averageDevTime: Data[week].totalDevTime / Data[week].count,
    }));

    setWeeklyData(formattedData);
  };

  useEffect(() => {
    if (data?.length > 0) {
      processWeeklyData(data);
    }
  }, [data]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box>
      <Typography className="Pagetitle">Pull Requests for {repo}</Typography>
      {data?.length ? (
        <>
          <ul>
            {data?.map((pr) => (
              <li key={pr.id}>
                <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                  {pr.title}
                </a>
                {pr.developmentTimeSeconds && (
                  <span> - Development Time: {pr.developmentTimeSeconds}</span>
                )}
              </li>
            ))}
          </ul>

          <div style={{ width: "1000px", height: "1000px" }}>
            <DevTimeChart weeklyData={weeklyData} />
          </div>
        </>
      ) : null}
    </Box>
  );
}
