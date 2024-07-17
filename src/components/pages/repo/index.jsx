import { GetRepos } from "@/api/repo";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import RepoTable from "./comp/table";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import CustomButton from "@/components/@core/Button";
import { showSuccessToastMessage } from "@/components/@core/Layout/notifySuccess";
import { showErrorToastMessage } from "@/components/@core/Layout/notifyError";
import { useRouter } from "next/router";

export default function RepoComponent({ repo }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = async () => {
      if (!repo?.length) {
        try {
          const session = await getSession();
          const response = await GetRepos({
            username: session.user.username,
            pat: session.user.pat,
          });
          if (response.status === 200) {
            router.replace(router.asPath);
            setLoading(false);
            showSuccessToastMessage("Data fetched and stored successfully");
          } else {
            console.error("Response Error:", response.data.error);
            showErrorToastMessage(response.data.error);
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching updated data:", err);
          showErrorToastMessage("Error fetching updated data.");
        }
      } else {
        setLoading(false);
      }
    };
    data();
  }, []);

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
          {repo?.length ? (
            <CustomButton
              onClick={() => router.push("/statistcs")}
              text={"Statistics"}
            />
          ) : null}
          <CustomButton onClick={() => signOut()} text={"Singout"} />
        </Stack>
      </Box>
      {!loading ? (
        <RepoTable row={repo} />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography mb={2}>Fetching Repositories</Typography>
            <CircularProgress />
          </Box>
        </Box>
      )}
    </>
  );
}
