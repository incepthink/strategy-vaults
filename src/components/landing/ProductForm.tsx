import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { Domine } from "next/font/google";

const domine = Domine({
  subsets: ["latin"],
  weight: ["400", "700"], // Choose which weights you want
  display: "swap",
});

const ProductForm = () => {
  return (
    <Box
      className="w-screen h-screen flex justify-center items-center relative overflow-hidden px-4"
      sx={{ backgroundColor: "secondary.main", color: "secondary.dark" }}
    >
      <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 items-center">
        <h4
          className={`text-center font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-xs sm:max-w-2xl lg:max-w-4xl leading-tight sm:leading-relaxed lg:leading-20 ${domine.className}`}
        >
          Your path to smarter investing begins today.
        </h4>

        <div
          className="rounded-2xl w-full max-w-[350px] sm:max-w-[400px] border-[#00DBFF] border-2 p-4 sm:p-6"
          style={{
            boxShadow:
              "4px 4px 34px 0px #629CFD, -4px -4px 34px 0px rgba(98, 156, 253, 0.25)",
          }}
        >
          <p className="text-center text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
            LOGO
          </p>
          <div>
            <form action="">
              <div className="flex flex-col gap-2 mb-4 sm:mb-6">
                <label
                  htmlFor="name"
                  className="text-[#888888] text-sm sm:text-base"
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="rounded-2xl p-3 sm:p-4 px-4 sm:px-5 text-lg sm:text-xl outline-none bg-[#BBBBBB26]"
                />
              </div>
              <div className="flex flex-col gap-2 mb-4 sm:mb-6">
                <label
                  htmlFor="email"
                  className="text-[#888888] text-sm sm:text-base"
                >
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Your Email"
                  className="rounded-2xl p-3 sm:p-4 px-4 sm:px-5 text-lg sm:text-xl outline-none bg-[#BBBBBB26]"
                />
              </div>
              <Button
                variant="gradient"
                className="w-full! rounded-xl! text-lg sm:text-xl! py-3 sm:py-4!"
              >
                Submit
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm text-[#7D7D7D] text-center mt-4 sm:mt-6">
            <p>
              Submitting this form means you consent to receive occasional
              product updates and announcements.
            </p>
            <p>You may opt out at any time.</p>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ProductForm;
