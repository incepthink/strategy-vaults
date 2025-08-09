import { Box, Button } from "@mui/material";
import React from "react";

const SecondaryDisplay = () => {
  return (
    <Box className="w-screen h-screen flex justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 flex justify-center">
        <video
          className="h-full object-cover"
          style={{
            maxWidth: "1920px",
            width: "100vw",
            objectPosition: "right center",
          }}
          src="/assets/bg-secondary.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/bg-liquid-poster.jpg"
          preload="auto"
        ></video>
      </div>
      <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 z-10 relative px-4 sm:px-8 md:px-16 lg:px-32">
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed font-medium text-center text-white`}
        >
          Lorem ipsum dolor sit amet consectetur. Mattis consectetur id egestas
          pharetra at. Iaculis et donec a posuere vitae consequat. Id auctor
          augue feugiat eget gravida vel donec quam.
        </h1>
      </div>
    </Box>
  );
};

export default SecondaryDisplay;
