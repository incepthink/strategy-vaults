import React, { useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

interface MaxButtonProps {
  tokenAddress?: string;
  onMaxClick: (maxAmount: string) => void;
  onBalanceUpdate?: (balance: string) => void;
  showMaxButton?: boolean;
  tokenSymbol?: string;
}

const MaxButton: React.FC<MaxButtonProps> = ({
  tokenAddress,
  onMaxClick,
  onBalanceUpdate,
  showMaxButton = true,
  tokenSymbol = "Token",
}) => {
  const { address } = useAccount();

  // Helper function to determine if we should fetch native ETH balance
  const shouldFetchNativeBalance = (tokenAddr?: string, symbol?: string) => {
    if (!tokenAddr) return true;

    // Special addresses that should use native balance
    const nativeAddresses = [
      "0x0000000000000000000000000000000000000000", // Common ETH placeholder
      "ETH", // Special case
    ];

    // Check for ETH-like symbols or WETH address
    const isETHLike =
      symbol === "ETH" ||
      tokenAddr.toLowerCase() === "0x0000000000000000000000000000000000000000";

    return nativeAddresses.includes(tokenAddr) || isETHLike;
  };

  const fetchNative = shouldFetchNativeBalance(tokenAddress, tokenSymbol);

  console.log("MaxButton Debug:", {
    tokenAddress,
    tokenSymbol,
    fetchNative,
    address,
  });

  // Use native balance for ETH-like tokens, ERC-20 balance for others
  const balanceQuery = useBalance({
    address,
    token: fetchNative ? undefined : (tokenAddress as `0x${string}`),
  });

  const maxHuman = balanceQuery.data
    ? formatUnits(balanceQuery.data.value, balanceQuery.data.decimals)
    : "0";

  const formattedBalance = parseFloat(maxHuman).toFixed(6);

  console.log("Balance Query Result:", {
    data: balanceQuery.data,
    maxHuman,
    formattedBalance,
    isLoading: balanceQuery.isLoading,
    error: balanceQuery.error,
  });

  // Update parent component with balance when it changes
  useEffect(() => {
    if (onBalanceUpdate) {
      onBalanceUpdate(maxHuman);
    }
  }, [maxHuman, onBalanceUpdate]);

  const handleMaxClick = () => {
    // Remove trailing zeros and unnecessary decimal points
    const cleanAmount = parseFloat(maxHuman).toString();
    onMaxClick(cleanAmount);
  };

  return (
    <div className="flex items-center gap-2">
      <Typography
        sx={{
          typography: { xs: "caption", sm: "body2" },
          color: "gray.400",
        }}
      >
        Balance:{" "}
        {balanceQuery.isLoading
          ? "Loading..."
          : `${formattedBalance} ${tokenSymbol}`}
      </Typography>
      {showMaxButton && parseFloat(maxHuman) > 0 && (
        <Button
          onClick={handleMaxClick}
          size="small"
          sx={{
            minWidth: "auto",
            padding: "2px 8px",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            color: "primary.main",
            backgroundColor: "rgba(58, 123, 213, 0.1)",
            border: "1px solid rgba(58, 123, 213, 0.3)",
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(58, 123, 213, 0.2)",
              border: "1px solid rgba(58, 123, 213, 0.5)",
            },
          }}
        >
          Max
        </Button>
      )}
    </div>
  );
};

export default MaxButton;
