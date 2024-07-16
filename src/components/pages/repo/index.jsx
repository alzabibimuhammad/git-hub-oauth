import { GetRepos } from "@/api/repo";
import { getSession, signOut } from "next-auth/react";
import { useState } from "react";
import RepoTable from "./comp/table";
import { Box, Stack } from "@mui/material";
import CustomButton from "@/components/@core/Button";
import { showSuccessToastMessage } from "@/components/@core/Layout/notifySuccess";
import { showErrorToastMessage } from "@/components/@core/Layout/notifyError";
import { useRouter } from "next/router";

export default function RepoComponent({ repo }) {
  const router = useRouter();
  const fetchRepo = async () => {
    try {
      const session = await getSession();
      const response = await GetRepos({
        username: session.user.username,
        pat: session.user.pat,
      });
      if (response.status === 200) {
        router.replace(router.asPath);
        showSuccessToastMessage("Data fetched and stored successfully");
      } else {
        console.error("Response Error:", response.data.error);
        showErrorToastMessage(response.data.error);
      }
    } catch (err) {
      console.error("Error fetching updated data:", err);
      showErrorToastMessage("Error fetching updated data.");
    }
  };

  return (
    <>
      <Box
        className="PageHeader"
        sx={{
          display: { xs: "block", sm: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <p className="Pagetitle">Repositories</p>
        </Box>
        <Stack
          mt={{ xs: 1, sm: 0 }}
          mb={{ xs: 1, sm: 0 }}
          direction={"row"}
          spacing={1}
        >
          <CustomButton
            onClick={() => router.push("/statistcs")}
            text={"Statistics"}
          />
          <CustomButton onClick={() => fetchRepo()} text={"Fetch"} />
          <CustomButton onClick={() => signOut()} text={"Singout"} />
        </Stack>
      </Box>
      <RepoTable row={repo} />
    </>
  );
}
