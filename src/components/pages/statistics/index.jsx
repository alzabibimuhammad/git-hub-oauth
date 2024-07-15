import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { format, startOfWeek } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DevTimeChart from "../pulls/comp/chart";
import { GetStatitics } from "@/api/statistics";

export default function StatisticsComponent({ data, repos }) {
  const [Data, setData] = useState(data);

  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
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
    if (Data?.length > 0) {
      processWeeklyData(Data);
    }
  }, [Data]);
  const handleChange = async (e) => {
    const repo = e.target.value;
    setSelectedRepo(repo);
    const data = await GetStatitics(repo);
    setData(data?.data);
  };
  return (
    <Grid container>
      <Grid item xs={9}>
        <TextField
          fullWidth
          select
          defaultValue=""
          value={selectedRepo}
          SelectProps={{
            displayEmpty: true,
            onChange: (e) => {
              handleChange(e);
            },
          }}
        >
          <MenuItem value="" selected>
            Repositories
          </MenuItem>
          {repos?.map((pr, index) => (
            <MenuItem key={index} value={pr.repo_name}>
              {pr.repo_name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={10}>
        <DevTimeChart weeklyData={weeklyData} />
      </Grid>
    </Grid>
  );
}
