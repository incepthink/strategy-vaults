import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

interface GradientCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  sx2?: SxProps<Theme>;
}

const GradientCard = ({ children, sx = {}, sx2 = {} }: GradientCardProps) => {
  return (
    <Box
      sx={{
        border: "2px solid transparent",
        borderRadius: "12px",
        background:
          "linear-gradient(0deg, #113355 0%, #3A7BD5 50%, #00D2FF 100%) border-box, transparent padding-box",
        backgroundClip: "padding-box, border-box",
        backgroundOrigin: "border-box",
        p: 0.2,
        width: "fit-content",
        boxShadow: 2,
        ...sx,
      }}
    >
      <div className="bg-[#000307] rounded-[12px] relative">
        <Box
          sx={{
            backgroundColor: "#000307",
            borderRadius: "12px",
            p: 3,
            position: "relative",
            ...sx2,
          }}
        >
          {children}
        </Box>
      </div>
    </Box>
  );
};

export default GradientCard;
