import { Box, Button } from "@mui/material";
import React from "react";

const FooterMain = () => {
  return (
    <Box className="w-screen px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 lg:py-16 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-0">
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
        <p className="text-4xl sm:text-5xl lg:text-6xl font-medium">LOGO</p>
        <p className="text-lg sm:text-xl max-w-xs">
          Set your outcomes today, so you can shape your future tomorrow.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="gradient"
            className="w-full sm:w-auto text-lg sm:text-xl! px-12 sm:px-16! py-3 sm:py-4! rounded-xl!"
          >
            Join Waitlist
          </Button>
          <Button
            variant="outlined"
            className="w-full sm:w-auto text-lg sm:text-xl! py-3 sm:py-4! rounded-xl!"
          >
            Read the White Paper
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4 text-lg sm:text-xl">
        <p>Follow us on X</p>
        <p>Read the White Paper</p>
        <p>Contact Us</p>
      </div>
    </Box>
  );
};

export default FooterMain;
