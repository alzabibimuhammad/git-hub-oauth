import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const PaginationComponent = ({ setPage, pagination }) => {
  const handleNextPage = () => {
    if (pagination?.currentPage < pagination?.lastPage) {
      setPage(pagination.currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.currentPage > 1) {
      setPage(pagination.currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  return (
    <Stack direction="row" alignItems="center">
      <NavigateBeforeIcon
        sx={{ cursor: "pointer" }}
        onClick={handlePreviousPage}
      />
      <ClearIcon
        fontSize="small"
        sx={{ cursor: "pointer" }}
        onClick={handleFirstPage}
      />
      <NavigateNextIcon sx={{ cursor: "pointer" }} onClick={handleNextPage} />
    </Stack>
  );
};

export default PaginationComponent;
