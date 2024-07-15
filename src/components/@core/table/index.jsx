import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import { gridClasses } from "@mui/x-data-grid";

const ODD_OPACITY = 0.2;

const Table = ({
  column,
  row,
  setSelectedRow,
  selectedRow,
  rowHeight,
  checkboxSelection,
}) => {
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: theme.palette.grey[200],
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
      "&.Mui-selected": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity
        ),
        "&:hover": {
          backgroundColor: alpha(
            theme.palette.secondary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity
          ),
          "@media (hover: none)": {
            backgroundColor: alpha(
              theme.palette.secondary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity
            ),
          },
        },
      },
    },
  }));
  const CustomNoRowsOverlay = () => (
    <GridOverlay sx={{ backgroundColor: "red" }}>
      <Typography
        sx={{ textAlign: "center", padding: "20px", fontSize: "16px" }}
      >
        No data available.
      </Typography>
    </GridOverlay>
  );

  return (
    <>
      <Stack>
        <Box sx={{ color: "#392467" }} width={"100%"}>
          <StripedDataGrid
            rows={row}
            columns={column}
            loading={row?.length === undefined}
            rowHeight={rowHeight ? rowHeight : 38}
            disableRowSelectionOnClick
            hideFooter={true}
            checkboxSelection={checkboxSelection === false ? false : true}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSelectedRow(newRowSelectionModel);
            }}
            autoHeight={true}
            rowSelectionModel={selectedRow}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
          />
        </Box>
      </Stack>
    </>
  );
};

export default Table;
