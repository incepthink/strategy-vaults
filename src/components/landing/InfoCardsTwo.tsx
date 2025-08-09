"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  textAlign: "left",
  color: "#7A7A7A",
  borderRadius: theme.spacing(1.5),
  border: "1px solid #e0e0e0",
  boxShadow: "none",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  backgroundColor: "#b0b0b0",
  height: "100%",
  width: "100%",
  marginTop: "auto",
}));

const InfoCardsTwo = () => {
  const features = [
    {
      id: 1,
      title: "Lorem ipsum dolor sit amet consectetur.",
      description:
        "Earn yield without managing it. Your inputs shape the strategy—your capital compounds passively.",
      hasImage: true,
    },
    {
      id: 2,
      title: "Lorem ipsum dolor sit amet consectetur.",
      description:
        "Funds never leave your smart account. No pools. No custodians. Self-custody by default—on-chain and transparent.",
      hasImage: true,
    },
    {
      id: 3,
      title: "Lorem ipsum dolor sit amet consectetur.",
      description:
        "You set your risk boundaries. Blend only executes pre-approved strategies within your parameters. No surprises. No deviation.",
      hasImage: true,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-8 sm:mb-12 lg:mb-18 text-center font-medium">
        Lorem ipsum dolor sit amet consectetur.
      </h2>
      <Box
        sx={{
          flexGrow: 1,
          padding: { xs: 1, sm: 2, lg: 3 },
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        <Grid container spacing={3}>
          {/* First row - Large card */}
          <Grid size={{ xs: 12 }}>
            <Item>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: { xs: 2, sm: 4, md: 10 },
                    py: { xs: 3, md: 0 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                      fontWeight: 500,
                      marginBottom: 2,
                      color: "secondary.dark",
                    }}
                  >
                    {features[0].title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" },
                      lineHeight: 1.6,
                    }}
                  >
                    {features[0].description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: { xs: "200px", md: "300px" },
                    height: "100%",
                  }}
                >
                  <ImagePlaceholder />
                </Box>
              </Box>
            </Item>
          </Grid>

          {/* Second row - Two equal cards */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Item sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, md: 4 } }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 2,
                  color: "secondary.dark",
                }}
              >
                {features[1].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" },
                  marginBottom: { xs: 4, md: 8 },
                  lineHeight: 1.6,
                }}
              >
                {features[1].description}
              </Typography>
              <ImagePlaceholder
                sx={{
                  marginTop: "auto",
                  minHeight: { xs: "180px", sm: "220px", md: "250px" },
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }}
              />
            </Item>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Item sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, md: 4 } }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  fontWeight: 500,
                  marginBottom: 2,
                  color: "secondary.dark",
                }}
              >
                {features[2].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" },
                  marginBottom: { xs: 4, md: 8 },
                  lineHeight: 1.6,
                }}
              >
                {features[2].description}
              </Typography>
              <ImagePlaceholder
                sx={{
                  marginTop: "auto",
                  minHeight: { xs: "180px", sm: "220px", md: "250px" },
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-4">
        <Button
          variant="gradient"
          className="w-full sm:w-auto text-lg sm:text-xl! py-4 sm:py-5! px-12 sm:px-16! rounded-xl!"
        >
          Join Waitlist
        </Button>
        <Button
          variant="outlined"
          className="w-full sm:w-auto rounded-xl! text-lg sm:text-xl! py-4 sm:py-5! border-2!"
        >
          Read the White Paper
        </Button>
      </div>
    </div>
  );
};

export default InfoCardsTwo;
