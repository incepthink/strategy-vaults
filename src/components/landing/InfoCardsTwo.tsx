"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import Image from "next/image";

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

const ImageContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  marginTop: "auto",
  position: "relative",
  overflow: "hidden",
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  backgroundColor: "#f5f5f5", // Fallback background
}));

const InfoCardsTwo = () => {
  const features = [
    {
      id: 1,
      title: "Step 1 — Browse Vaults",
      description:
        "Choose from a variety of strategy vaults managed by seasoned professionals, each with a transparent track record.",
      hasImage: true,
      image: "/assets/step-1.png",
    },
    {
      id: 2,
      title: "Step 2 — Deposit Funds",
      description:
        "Invest your assets in minutes. We support multiple chains and stable assets.",
      hasImage: true,
      image: "/assets/step-2.png",
    },
    {
      id: 3,
      title: "Step 3 — Automated Execution",
      description:
        "Your strategy runs 24/7 — optimized for returns, managed for risk.",
      hasImage: true,
      image: "/assets/step-1.png",
    },
    {
      id: 4,
      title: "Step 4 — Track Performance",
      description:
        "Real-time performance dashboards keep you informed every step of the way.",
      hasImage: true,
      image: "/assets/step-4.png",
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-8 sm:mb-12 lg:mb-18 text-center font-medium">
        How It Works
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
          {/* Step 1 */}
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
                {features[0].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" },
                  marginBottom: { xs: 4, md: 8 },
                  lineHeight: 1.6,
                }}
              >
                {features[0].description}
              </Typography>
              <ImageContainer
                sx={{
                  minHeight: { xs: "180px", sm: "220px", md: "250px" },
                }}
              >
                {features[0].hasImage && features[0].image ? (
                  <Image
                    src={features[0].image}
                    alt={features[0].title}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      // Hide image on error and show placeholder
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#b0b0b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="white">
                      Image Coming Soon
                    </Typography>
                  </Box>
                )}
              </ImageContainer>
            </Item>
          </Grid>

          {/* Step 2 */}
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
              <ImageContainer
                sx={{
                  minHeight: { xs: "180px", sm: "220px", md: "250px" },
                }}
              >
                {features[1].hasImage && features[1].image ? (
                  <Image
                    src={features[1].image}
                    alt={features[1].title}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#b0b0b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="white">
                      Image Coming Soon
                    </Typography>
                  </Box>
                )}
              </ImageContainer>
            </Item>
          </Grid>

          {/* Step 3 */}
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
              <ImageContainer
                sx={{
                  minHeight: { xs: "180px", sm: "220px", md: "250px" },
                }}
              >
                {features[2].hasImage && features[2].image ? (
                  <Image
                    src={features[2].image}
                    alt={features[2].title}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#b0b0b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="white">
                      Image Coming Soon
                    </Typography>
                  </Box>
                )}
              </ImageContainer>
            </Item>
          </Grid>

          {/* Step 4 */}
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
                {features[3].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" },
                  marginBottom: { xs: 4, md: 8 },
                  lineHeight: 1.6,
                }}
              >
                {features[3].description}
              </Typography>
              <ImageContainer
                sx={{
                  minHeight: { xs: "180px", sm: "220px", md: "250px" },
                }}
              >
                {features[3].hasImage && features[3].image ? (
                  <Image
                    src={features[3].image}
                    alt={features[3].title}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#b0b0b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="white">
                      Image Coming Soon
                    </Typography>
                  </Box>
                )}
              </ImageContainer>
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
