import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
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
      <Grid container mt={{ xs: 7, sm: 5 }} spacing={{ xs: 3, sm: 0 }}>
        {data?.length ? (
          <>
            <Grid
              item
              xs={12}
              maxHeight={{ xs: 300, sm: 600 }}
              overflow={"auto"}
              sm={4}
            >
              <List sx={{ width: "100%", maxWidth: "100%" }}>
                {data.map((pr) => (
                  <ListItem key={pr.id}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="h6">{pr.title}</Typography>}
                      secondary={
                        <Typography variant="p">
                          Development Time:{" "}
                          <Typography variant="p" sx={{ color: "red" }}>
                            {pr.developmentTimeSeconds}
                          </Typography>
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <DevTimeChart weeklyData={weeklyData} />
              </Paper>
            </Grid>
          </>
        ) : (
          <Grid
            item
            xs={12}
            height={"50vh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant="h3" color={"green"}>
              No pull requests found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
