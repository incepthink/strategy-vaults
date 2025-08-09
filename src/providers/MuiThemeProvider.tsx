"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";

const MuiThemeProvider = ({ children }: any) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
        contrastText: "#6683A7",
        dark: "#000307",
        light: "#11335599",
      },
      secondary: {
        main: "#fff",
        dark: "#000000",
        light: "#B9B7FE1A",
        contrastText: "#494950",
      },
      card: {
        main: "#11335533",
        light: "#7774FF1A",
        contrastText: "#6683A7",
      },
      text: {
        primary: "#fff",
        secondary: "#000000",
      },
    },
    gradients: {
      primary: "linear-gradient(0deg, #113355 0%, #3A7BD5 50%, #00D2FF 100%)",
      red: "linear-gradient(to top, #3F1D38 0%, #AF5279 50%, #FFD6A5 100%)",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          outlined: {
            borderColor: "#00DBFF",
            color: "#00DBFF",
          },
        },
        variants: [
          {
            props: { variant: "gradient" },
            style: {
              background:
                "linear-gradient(0deg, #113355 0%, #3A7BD5 50%, #00D2FF 100%)",
              color: "#fff",
              "&:hover": {
                background:
                  "linear-gradient(0deg, #113355 10%, #3A7BD5 60%, #00D2FF 100%)",
              },
            },
          },
        ],
      },
      MuiCard: {
        variants: [
          {
            props: { variant: "gradient" },
            style: {
              border: "2px solid transparent",
              borderImage:
                "linear-gradient(0deg, #113355 0%, #3A7BD5 50%, #00D2FF 100%) 1",
              background: "inherit", // Keeps the rest of the Card as is
              boxShadow: "inherit",
            },
          },
        ],
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
