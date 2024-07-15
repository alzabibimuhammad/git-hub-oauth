import { CreatedAtFormatDate } from "@/utils/createdAtFormatDate";
import { CreatedAtFormatTime } from "@/utils/createdAtFormatTime";
import { IconButton, Stack, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/router";
export default function useRepoColumns() {
  const router = useRouter();

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 800,
      renderCell: (params) => (
        <div className="DataGridtd">
          <p className="custome-data-grid-font">{params?.row?.name}</p>
        </div>
      ),
    },

    {
      field: "createdAtRepo",
      headerName: "Created At",
      minWidth: 800,

      renderCell: (params) => (
        <Stack direction={"column"} alignItems={"start"}>
          <Typography className="custome-data-grid-font-createdAt-date">
            {CreatedAtFormatDate(params?.row?.createdAtRepo)}
          </Typography>
          <Typography className="custome-data-grid-font-createdAt-time">
            {CreatedAtFormatTime(params?.row?.createdAtRepo)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,

      renderCell: (params) => (
        <div className="DataGridtd">
          <IconButton
            size="small"
            onClick={() => router.push(`/pull-requests/${params.row.name}`)}
          >
            <VisibilityIcon sx={{ color: "#392467" }} />
          </IconButton>
        </div>
      ),
    },
  ];
  return {
    columns,
  };
}
