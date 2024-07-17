import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
export default function Login() {
  const handleLogin = () => {
    signIn("google");
  };

  return (
    <Grid container height={"92.5vh"} overflow={"hidden"}>
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
            <Typography fontSize={{ xs: "25px", md: "30px" }} fontWeight={800}>
              Sign in with Google
            </Typography>
            <FaGoogle
              style={{ cursor: "pointer" }}
              onClick={handleLogin}
              size={55}
            />
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
        <img src="assets/loginLogo/icon.svg" alt="Icon" />
      </Grid>
    </Grid>
  );
}
