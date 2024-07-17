import { Grid, MenuItem, Paper, TextField } from "@mui/material";
import { format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import DevTimeChart from "../pulls/comp/chart";
import { GetStatitics } from "@/api/statistics";

export default function StatisticsComponent({ data, repos, username }) {
  const [Data, setData] = useState(data);

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

    formattedData.sort((a, b) => new Date(b.week) - new Date(a.week));

    setWeeklyData(formattedData);
  };

  useEffect(() => {
    if (Data?.length > 0) {
      processWeeklyData(Data);
    }
  }, [Data]);
  const handleChange = async (e) => {
    const repo = e.target.value;
    const data = await GetStatitics(repo, username);
    setData(data?.data);
  };
  return (
    <Grid container paddingLeft={{ xs: 0, sm: "10%" }} spacing={4}>
      <Grid item xs={9}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <TextField
            fullWidth
            select
            defaultValue=""
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
        </Paper>
      </Grid>
      <Grid item xs={10}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <DevTimeChart weeklyData={weeklyData} />
        </Paper>
      </Grid>
    </Grid>
  );
}
