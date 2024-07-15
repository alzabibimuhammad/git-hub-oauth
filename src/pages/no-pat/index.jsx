import {
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { showErrorToastMessage } from "@/components/@core/Layout/notifyError";
import { storePat } from "@/api/pat";
import { useRouter } from "next/router";
import { getSessionUser } from "@/services/auth";
import { getSession } from "next-auth/react";
import PatService from "@/services/pat";

export default function NoPat({ username }) {
  const [pat, setPat] = useState("");
  const route = useRouter();

  const handleSubmit = async () => {
    if (pat) {
      try {
        const response = await storePat({ username, pat });
        if (response?.status === 200) {
          showSuccessToastMessage("Personal Access Token saved successfully");
          route.push("/repo");
        }
      } catch (error) {}
    } else {
      console.error("PAT is required");
      showErrorToastMessage("Please write your PAT");
    }
  };

  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        md={6}
        sm={7}
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
            width: { xs: "70%", sm: "50%" },
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            flexDirection={"column"}
            justifyContent={"space-around"}
            height={"100%"}
          >
            <Typography fontSize={{ xs: "25px", md: "25px" }} fontWeight={800}>
              Add your personal access token
            </Typography>
            <TextField
              label="PAT"
              name="token"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid
        item
        md={6}
        sm={5}
        xs={0}
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/assets/loginLogo/icon.svg" alt="Icon" />
      </Grid>
    </Grid>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    const patService = new PatService(null, session?.user?.username);
    const user = await patService.get();
    const pat = user?.pat;

    if (pat)
      return {
        redirect: {
          destination: "/repo",
          permanent: false,
        },
      };
    else
      return {
        props: {
          username: session.user.username,
        },
      };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
