import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

interface GradientCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  sx2?: SxProps<Theme>;
  animationSpeed?: "slow" | "normal" | "fast";
}

const GradientCard = ({
  children,
  sx = {},
  sx2 = {},
  animationSpeed = "normal",
}: GradientCardProps) => {
  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case "slow":
        return "6s";
      case "fast":
        return "2s";
      default:
        return "6s";
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "12px",
        p: 0.2,
        width: "fit-content",
        boxShadow: 2,
        background: "#000307",
        overflow: "hidden",
        ...sx,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "12px",
          padding: "2px",
          background: `
            linear-gradient(
              0deg,
              #113355 0%,
              #3A7BD5 25%,
              #00D2FF 50%,
              #3A7BD5 75%,
              #113355 100%
            )
          `,
          backgroundSize: "100% 400%",
          animation: `gradientFlow ${getAnimationDuration()} ease-in-out infinite`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        },
        "@keyframes gradientFlow": {
          "0%": {
            backgroundPosition: "0% 0%",
          },
          "50%": {
            backgroundPosition: "0% 100%",
          },
          "100%": {
            backgroundPosition: "0% 0%",
          },
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#000307",
          borderRadius: "10px",
          p: 3,
          position: "relative",
          zIndex: 1,
          ...sx2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default GradientCard;
