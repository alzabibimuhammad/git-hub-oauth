import { Button } from "@mui/material";

export default function CustomButton({ text, type, onClick }) {
  return (
    <Button
      sx={{
        backgroundColor: "#392467",
        color: "#f9f9f9",

        ":hover": {
          backgroundColor: "#f9f9f9",
          color: "#392467",
        },
      }}
      onClick={onClick}
      type={type}
    >
      {text}
    </Button>
  );
}
