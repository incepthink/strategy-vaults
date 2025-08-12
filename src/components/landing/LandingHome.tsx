import { Box, Button } from "@mui/material";
import React from "react";
import { Domine } from "next/font/google";

const domine = Domine({
  subsets: ["latin"],
  weight: ["400", "700"], // Choose which weights you want
  display: "swap",
});

const LandingHome = () => {
  return (
    <Box className="w-screen h-screen flex justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 flex justify-center">
        <video
          className="h-full object-cover"
          style={{ maxWidth: "1920px", width: "100vw" }}
          src="/assets/bg-liquid.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/bg-liquid-poster.jpg"
          preload="auto"
        ></video>
      </div>
      <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 z-10 relative px-4">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center text-white domine.className ${domine.className}`}
        >
          Real World Yields On-Chain
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center text-white">
          Grow your capital with our safe and secure strategy vaults
        </p>
        <Button
          variant="gradient"
          className="w-72 sm:w-80 lg:w-96 text-lg sm:text-xl! py-3 sm:py-4! rounded-xl!"
        >
          Join Waitlist
        </Button>
      </div>
    </Box>
  );
};

export default LandingHome;
