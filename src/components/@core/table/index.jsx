import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import { gridClasses } from "@mui/x-data-grid";
import PaginationComponent from "../pagination";

const ODD_OPACITY = 0.2;

const Table = ({
  column,
  row,
  label,
  pagination,
  setPage,
  setSelectedRow,
  selectedRow,
  rowHeight,
  checkboxSelection,
  paginationFlag = true,
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
          <h1 style={{ textAlign: "center" }}>{label}</h1>
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

          {paginationFlag && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography> Rows : {pagination?.total} </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography>
                  Current Page : {pagination?.currentPage} of{" "}
                  {pagination?.lastPage}
                </Typography>
                <PaginationComponent
                  setPage={setPage}
                  pagination={pagination}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
    </>
  );
};

export default Table;
