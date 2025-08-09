"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import { Grid, Paper, Typography, Box } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  ...theme.typography.body2,
  textAlign: "left",
  color: (theme.vars ?? theme).palette.secondary.dark,
  borderRadius: theme.spacing(1.5),
  border: "1px solid #e0e0e0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const InfoCardsOne = () => {
  const features = [
    {
      id: 1,
      title: "Best Strategies",
      description:
        "Our strategy managers are carefully curated with proven track records",
    },
    {
      id: 2,
      title: "Transparent Custody",
      description:
        "Stable vaults use CeFi and Copper thereby always maintaining a Proof of Reserve",
    },
    {
      id: 3,
      title: "Diversified Portfolio",
      description:
        "Our strategy managers are carefully curated with proven track records",
    },
    {
      id: 4,
      title: "Best Strategies",
      description:
        "Our strategy managers are carefully curated with proven track records",
    },
    {
      id: 5,
      title: "Best Strategies",
      description:
        "Our strategy managers are carefully curated with proven track records",
    },
    {
      id: 6,
      title: "Diversified Portfolio",
      description:
        "Our strategy managers are carefully curated with proven track records",
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-8 sm:mb-12 lg:mb-18">
        Capital Markets meet on-chain tokens
      </h2>
      <Box sx={{ flexGrow: 1, margin: "0 auto" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Item
              sx={{
                px: { xs: 2, md: 6 },
                py: { xs: 3, md: 10 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "secondary.dark",
                }}
              >
                {features[0].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  color: "secondary.contrastText",
                }}
              >
                {features[0].description}
              </Typography>
            </Item>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Item
              sx={{
                px: { xs: 2, md: 6 },
                py: { xs: 3, md: 10 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "secondary.dark",
                }}
              >
                {features[1].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  color: "secondary.contrastText",
                }}
              >
                {features[1].description}
              </Typography>
            </Item>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Item
              sx={{
                px: { xs: 2, md: 6 },
                py: { xs: 3, md: 10 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "secondary.dark",
                }}
              >
                {features[2].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  color: "secondary.contrastText",
                }}
              >
                {features[2].description}
              </Typography>
            </Item>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Item
              sx={{
                px: { xs: 2, md: 6 },
                py: { xs: 3, md: 10 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "secondary.dark",
                }}
              >
                {features[3].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  color: "secondary.contrastText",
                }}
              >
                {features[3].description}
              </Typography>
            </Item>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Item
              sx={{
                px: { xs: 2, md: 6 },
                py: { xs: 3, md: 10 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "secondary.dark",
                }}
              >
                {features[4].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  color: "secondary.contrastText",
                }}
              >
                {features[4].description}
              </Typography>
            </Item>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Item
              sx={{
                px: { xs: 2, md: 6 },
                py: { xs: 3, md: 10 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "secondary.dark",
                }}
              >
                {features[5].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  color: "secondary.contrastText",
                }}
              >
                {features[5].description}
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default InfoCardsOne;
