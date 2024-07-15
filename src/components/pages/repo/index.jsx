import { GetRepos } from "@/api/repo";
import { signOut } from "next-auth/react";
import { useState } from "react";
import RepoTable from "./comp/table";
import { Box, Stack } from "@mui/material";
import CustomButton from "@/components/@core/Button";
import { showSuccessToastMessage } from "@/components/@core/Layout/notifySuccess";
import { showErrorToastMessage } from "@/components/@core/Layout/notifyError";

export default function RepoComponent({ initialRepo, pat }) {
  const [repo, setRepo] = useState(initialRepo);

  const fetchRepo = async () => {
    try {
      const response = await GetRepos();
      if (response.status === 200) {
        const data = response.data;
        showSuccessToastMessage("Data fetched and stored successfully");
        setRepo(data.repo);
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
      <Box className="PageHeader">
        <Box>
          <p className="Pagetitle">Repositories</p>
        </Box>
        <Stack direction={"row"} spacing={1}>
          <CustomButton onClick={() => _} text={"Statistics"} />
          <CustomButton onClick={() => fetchRepo()} text={"Fetch"} />
          <CustomButton onClick={() => signOut()} text={"Singout"} />
        </Stack>
      </Box>
      <RepoTable row={repo} />
    </>
  );
}
