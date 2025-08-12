import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import GradientCard from "../GradientCard";
import ConnectButton from "../ConnectButton";
import { VaultDetail } from "@/hooks/useVaults";
import { useUserVaultBalances } from "@/hooks/useUserVaultBalances";
import { useWithdrawal } from "@/hooks/useWithdrawal";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useTxDialog, getErrorMessage } from "@/components/TxResultDialog";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  10: "Optimism",
  137: "Polygon",
  42161: "Arbitrum",
  8453: "Base",
  11155111: "Sepolia",
};

// WithdrawMaxButton component
interface WithdrawMaxButtonProps {
  stakedBalance: string;
  onMaxClick: (maxAmount: string) => void;
  showMaxButton?: boolean;
  tokenSymbol?: string;
  isLoading?: boolean;
}

const WithdrawMaxButton: React.FC<WithdrawMaxButtonProps> = ({
  stakedBalance,
  onMaxClick,
  showMaxButton = true,
  tokenSymbol = "Token",
  isLoading = false,
}) => {
  const formattedBalance = parseFloat(stakedBalance).toFixed(4);
  const hasBalance = parseFloat(stakedBalance) > 0;

  const handleMaxClick = () => {
    onMaxClick(stakedBalance);
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
        {isLoading ? "Loading..." : `${formattedBalance} ${tokenSymbol}`}
      </Typography>
      {showMaxButton && hasBalance && !isLoading && (
        <Button
          onClick={handleMaxClick}
          size="small"
          sx={{
            minWidth: "auto",
            padding: "2px 8px",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            color: "#ef4444", // red-500
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
            },
          }}
        >
          Max
        </Button>
      )}
    </div>
  );
};

// Main WithdrawForm component
interface WithdrawFormProps {
  vault?: VaultDetail;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ vault }) => {
  const { Dialog: TxDialog, openSuccess, openError } = useTxDialog();

  const [amount, setAmount] = useState("");
  const [switching, setSwitching] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { chains, switchChainAsync } = useSwitchChain();

  const { getVaultAmount, loading: balanceLoading } = useUserVaultBalances({
    address: userAddress,
    nonzero: true,
  });

  const {
    requestWithdrawal,
    validateWithdrawal,
    loading: withdrawLoading,
    error: withdrawError,
    clearError,
  } = useWithdrawal();

  const token = vault?.deposit_token || {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logo: undefined,
    address: "",
  };

  const vaultChainId = vault?.raw.chain_id ?? chainId;
  const targetChain = chains.find((c) => c.id === vaultChainId);
  const targetChainName =
    targetChain?.name ?? CHAIN_NAMES[vaultChainId] ?? `Chain ${vaultChainId}`;
  const wrongChain = isConnected && !!vault && chainId !== vaultChainId;

  const stakedBalance = vault ? getVaultAmount(vault.id) : "0.00";
  const hasBalance = parseFloat(stakedBalance) > 0;

  // Calculate new balance after withdrawal
  const newBalance = useMemo(() => {
    if (!amount || !stakedBalance) return null;
    try {
      const currentBalance = parseFloat(stakedBalance);
      const withdrawAmount = parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) return null;
      return Math.max(0, currentBalance - withdrawAmount);
    } catch {
      return null;
    }
  }, [amount, stakedBalance]);

  const handleMaxClick = (maxAmount: string) => {
    setAmount(maxAmount);
    clearError();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    clearError();
  };

  const handleSwitch = async () => {
    if (!vault) return;
    try {
      setSwitching(true);
      await switchChainAsync({ chainId: vaultChainId });
    } catch (e) {
      openError({
        title: "Switch network failed",
        message: getErrorMessage(e),
      });
    } finally {
      setSwitching(false);
    }
  };

  const handleWithdraw = () => {
    if (!vault || !amount) return;
    if (wrongChain) return handleSwitch();

    const validation = validateWithdrawal({
      vaultId: vault.id,
      amount,
      tokenDecimals: token.decimals,
    });
    if (!validation.isValid) return;

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!vault || !amount) return;

    setShowConfirmDialog(false);

    try {
      const result = await requestWithdrawal({
        vaultId: vault.id,
        amount,
        tokenAddress: token.address,
        tokenDecimals: token.decimals,
        vaultChainId,
      });

      console.log("Withdrawal successful:", result);
      setAmount("");

      // Show success dialog
      openSuccess({
        title: "Withdrawal submitted",
        message: `You withdrew ${amount} ${token.symbol} from ${vault.name}. Withdrawals are processed within 24 hours.`,
      });
    } catch (error) {
      console.error("Withdrawal failed:", error);

      // Show error dialog
      openError({
        title: "Withdrawal failed",
        message: getErrorMessage(error),
      });
    }
  };

  const handleCancelWithdraw = () => {
    setShowConfirmDialog(false);
  };

  const isValidWithdrawal =
    !!amount &&
    !!vault &&
    validateWithdrawal({
      vaultId: vault.id,
      amount,
      tokenDecimals: token.decimals,
    }).isValid;

  // Check if withdraw button should be disabled
  const isWithdrawDisabled = !isValidWithdrawal || withdrawLoading;

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
        Withdrawals are processed within 24 hours
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
          {isConnected && (
            <WithdrawMaxButton
              stakedBalance={stakedBalance}
              onMaxClick={handleMaxClick}
              showMaxButton={true}
              tokenSymbol={token.symbol}
              isLoading={balanceLoading}
            />
          )}
        </div>

        <Box sx={{ borderRadius: "8px" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {token.logo ? (
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
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
              )}
              <Typography
                sx={{
                  typography: { xs: "body2", md: "h5" },
                  color: "white",
                }}
                className="font-medium"
              >
                {token.symbol}
              </Typography>
            </div>

            <TextField
              value={amount}
              onChange={handleAmountChange}
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

      {/* Error Display */}
      {withdrawError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <Typography
            sx={{
              typography: { xs: "caption", sm: "body2" },
              color: "#ef4444",
            }}
          >
            {withdrawError}
          </Typography>
        </div>
      )}

      {/* Staked Balance with Preview */}
      <div className="flex justify-between items-center">
        <Typography
          sx={{
            typography: { xs: "body2", sm: "body1" },
            color: "primary.contrastText",
            paddingLeft: 0.5,
          }}
        >
          Staked Balance
        </Typography>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Typography
              sx={{
                typography: { xs: "body2", sm: "h6" },
                color: "white",
              }}
              className="font-medium"
            >
              {isConnected
                ? balanceLoading
                  ? "Loading..."
                  : `${parseFloat(stakedBalance).toFixed(4)} ${token.symbol}`
                : "Connect wallet"}
            </Typography>

            {/* Arrow and new balance preview */}
            {newBalance !== null && amount && parseFloat(amount) > 0 && (
              <>
                <Typography
                  sx={{
                    color: "#ef4444",
                    fontSize: "14px",
                    mx: 1,
                  }}
                >
                  →
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: "body2", sm: "h6" },
                    color: "#ef4444",
                    fontWeight: 500,
                  }}
                >
                  {newBalance.toFixed(4)} {token.symbol}
                </Typography>
              </>
            )}
          </div>

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
      {!isConnected ? (
        <ConnectButton fullWidth label="🔗 Connect" />
      ) : wrongChain ? (
        <Button
          variant="contained"
          fullWidth
          onClick={handleSwitch}
          disabled={switching}
          sx={{
            background: "gradients.primary",
            color: "white",
            "&:disabled": {
              opacity: 0.5,
              background: "gradients.primary",
              color: "white",
            },
            "&:hover": {
              background: "gradients.primary",
              opacity: 0.9,
            },
          }}
        >
          {switching ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1, color: "inherit" }} />
              Switching…
            </>
          ) : (
            `Switch to ${targetChainName}`
          )}
        </Button>
      ) : (
        <Button
          variant="gradientRed"
          fullWidth
          onClick={handleWithdraw}
          disabled={isWithdrawDisabled}
          sx={{
            fontSize: "16px",
            color: "white",
            "&:disabled": {
              opacity: 0.5,
              background: "gradients.primary",
              color: "white",
            },
            "&:hover": {
              background: "gradients.primary",
              opacity: 0.9,
            },
          }}
        >
          {withdrawLoading ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1, color: "inherit" }} />
              Processing...
            </>
          ) : (
            `Withdraw ${amount ? `${amount} ${token.symbol}` : token.symbol}`
          )}
        </Button>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelWithdraw}
        PaperProps={{
          sx: {
            bgcolor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            minWidth: "400px",
          },
        }}
        BackdropProps={{
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#1a1a1a",
            borderBottom: "1px solid #333",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500 }}>
            Confirm Withdrawal
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            bgcolor: "#1a1a1a",
            color: "#fff",
            textAlign: "center",
            py: 3,
            mt: 2,
          }}
        >
          <Typography variant="body1" sx={{ mb: 2, color: "#e0e0e0" }}>
            You are about to withdraw:
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: "#ef4444",
              fontWeight: 600,
            }}
          >
            {amount} {token.symbol}
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, color: "#b0b0b0" }}>
            From: {vault?.name}
          </Typography>

          {newBalance !== null && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#2a2a2a",
                borderRadius: 1,
                border: "1px solid #333",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#888", display: "block" }}
              >
                Your staked balance will change:
              </Typography>
              <Typography variant="body2" sx={{ color: "#fff", mt: 1 }}>
                {parseFloat(stakedBalance).toFixed(2)} {token.symbol} →{" "}
                {newBalance.toFixed(2)} {token.symbol}
              </Typography>
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{
              mt: 2,
              color: "#888",
              display: "block",
              fontStyle: "italic",
            }}
          >
            Withdrawals are processed within 24 hours
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            bgcolor: "#1a1a1a",
            borderTop: "1px solid #333",
            p: 2,
            gap: 1,
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleCancelWithdraw}
            variant="outlined"
            sx={{
              borderColor: "#555",
              color: "#fff",
              "&:hover": {
                borderColor: "#777",
                bgcolor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmWithdraw}
            variant="contained"
            disabled={withdrawLoading}
            sx={{
              color: "white",
              bgcolor: "#ef4444",
              "&:hover": {
                bgcolor: "#dc2626",
              },
              "&:disabled": {
                opacity: 0.5,
                bgcolor: "#ef4444",
              },
            }}
          >
            {withdrawLoading ? (
              <>
                <CircularProgress size={18} sx={{ mr: 1, color: "inherit" }} />
                Processing...
              </>
            ) : (
              "Confirm Withdrawal"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Modal */}
      {TxDialog}
    </div>
  );
};

export default WithdrawForm;
