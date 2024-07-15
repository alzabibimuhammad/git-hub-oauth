import { Card, CardContent } from "@mui/material";
import React from "react";

const PageContent = ({ children }) => {
  return (
    <Card
      sx={{
        height: "97vh",
        backgroundColor: "#F9F9F9",
        overflowX: "hidden",
        overflowY: "auto",
        width: "100%",
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default PageContent;
