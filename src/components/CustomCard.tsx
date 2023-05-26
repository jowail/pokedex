import { Box, SxProps } from "@mui/material";
import React from "react";
import { secondaryColour } from "../utils/colours";
import { Theme } from "@emotion/react";

type CustomCardProp = {
  sx: SxProps<Theme>;
  children?: JSX.Element | JSX.Element[] | string | string[];
};

export const CustomCard: React.FC<CustomCardProp> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        ...sx,
        bgcolor: "white",
        borderRadius: "15px",
        boxShadow: `0 5px ${secondaryColour}`,
      }}
    >
      {children}
    </Box>
  );
};
