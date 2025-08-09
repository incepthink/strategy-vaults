import { Box, Typography, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import GradientCard from "../GradientCard";

const WithdrawForm = () => {
  const [amount, setAmount] = useState("");
  const [balance] = useState("0.00");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Info Text */}
      <Typography
        sx={{
          typography: { xs: "caption", sm: "body2" },
          color: "primary.contrastText",
          lineHeight: 1.5,
          marginBottom: 2,
        }}
      >
        After the 1 day redemption period, your funds can be withdrawn to your
        wallet.
      </Typography>

      <Typography
        sx={{
          typography: { xs: "caption", sm: "body2" },
          color: "primary.contrastText",
          lineHeight: 1.5,
          marginBottom: 2,
        }}
      >
        The maximum withdrawal amount is based on share value at request time,
        though the final amount may be lower.
      </Typography>

      {/* Amount Input */}
      <GradientCard
        sx={{ width: "100%" }}
        sx2={{ padding: 2, backgroundColor: "card.main" }}
      >
        <div className="flex justify-between items-center mb-6">
          <Typography
            sx={{
              typography: { xs: "body2", sm: "body1" },
              color: "gray.300",
            }}
          >
            Amount
          </Typography>
          <Typography
            sx={{
              typography: { xs: "caption", sm: "body2" },
              color: "gray.400",
            }}
          >
            Max:
          </Typography>
        </div>

        <Box
          sx={{
            // backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            // border: "1px solid rgba(255,255,255,0.1)",
          }}
          className=""
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Typography
                  sx={{
                    typography: { xs: "caption", sm: "body2" },
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  $
                </Typography>
              </div>
              <Typography
                sx={{
                  typography: { xs: "body2", md: "h5" },
                  color: "white",
                }}
                className="font-medium"
              >
                USDC
              </Typography>
            </div>

            <TextField
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: "white",
                  typography: { xs: "body1", sm: "h5" },
                  "& input": {
                    textAlign: "right",
                    padding: 0,
                  },
                  "& input::placeholder": {
                    color: "gray.500",
                    opacity: 1,
                  },
                },
              }}
              sx={{ flexGrow: 1 }}
            />
          </div>
        </Box>
      </GradientCard>

      {/* Balance */}
      <div className="flex justify-between items-center">
        <Typography
          sx={{
            typography: { xs: "body2", sm: "body1" },
            color: "primary.contrastText",
            paddingLeft: 0.5,
          }}
        >
          Balance
        </Typography>
        <div className="flex items-center gap-2">
          <Typography
            sx={{
              typography: { xs: "body2", sm: "h6" },
              color: "white",
            }}
            className="font-medium"
          >
            {balance}
          </Typography>
          <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
            <Typography
              sx={{
                typography: { xs: "caption", sm: "caption" },
                color: "white",
                fontSize: "8px",
              }}
            >
              ?
            </Typography>
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "transparent",
          color: "#D4D4D8",
          fontSize: { xs: "0.875rem", sm: "1rem" }, // matches body2/body1
          lineHeight: 1.5,
          fontFamily: "'Courier New', Courier, monospace",
          textTransform: "none",
          fontWeight: 500,
          height: { xs: "44px", sm: "48px" },
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(58, 123, 213, 0.1)",
          },
          "&:disabled": {
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "gray.500",
          },
        }}
      >
        🔗 Connect
      </Button>
    </div>
  );
};

export default WithdrawForm;
