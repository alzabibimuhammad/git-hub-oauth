import {
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import { showErrorToastMessage } from "@/components/@core/Layout/notifyError";
import { storePat } from "@/api/pat";
import { useRouter } from "next/router";
import { showSuccessToastMessage } from "@/components/@core/Layout/notifySuccess";
import { getUserName } from "@/api/github";

export default function NoPat({ id }) {
  const [pat, setPat] = useState("");
  const route = useRouter();
  console.log("hi id", id);

  const handleSubmit = async () => {
    if (pat) {
      const response = await getUserName(pat);
      if (!response) {
        showErrorToastMessage("Network error");
        return;
      }
      if (response?.ok) {
        const data = await response.json();
        const username = data?.login;
        try {
          const response = await storePat({ id, username, pat });

          if (response?.status == 200) {
            showSuccessToastMessage("Personal Access Token saved successfully");
            route.push("/repo");
          }
        } catch (error) {}
      } else {
        showErrorToastMessage("this token is not good");
      }
    } else {
      showErrorToastMessage("Please write your PAT");
    }
  };

  return (
    <Grid container height={"92.5vh"}>
      <Grid
        item
        md={6}
        sm={12}
        xs={12}
        sx={{
          backgroundColor: "#392467",
          display: "flex",
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            boxShadow: "0 0 6px #F9F9F9",
            backgroundColor: "#F9F9F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: { xs: "70%", sm: "50%" },
            width: { xs: "80%", sm: "50%" },
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            flexDirection={"column"}
            justifyContent={"space-around"}
            height={"100%"}
          >
            <Typography
              ml={2}
              fontSize={{ xs: "25px", md: "25px" }}
              fontWeight={800}
            >
              Add your personal access token from github
            </Typography>
            <Stack width={"90%"} spacing={1}>
              <TextField
                label="PAT"
                name="token"
                value={pat}
                fullWidth
                onChange={(e) => setPat(e.target.value)}
              />
              <Stack width={"100%"} direction={"row"} justifyContent={"center"}>
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "30%" }}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      <Grid
        item
        md={6}
        sx={{
          height: "100%",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/assets/loginLogo/icon.svg" alt="Icon" />
      </Grid>
    </Grid>
  );
}
