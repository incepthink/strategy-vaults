"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
  useSwitchChain,
  useSendTransaction,
} from "wagmi";
import { parseUnits } from "viem";
import axios from "axios";
import GradientCard from "../GradientCard";
import ConnectButton from "../ConnectButton";
import MaxButton from "./MaxButton";
import { BACKEND_URL } from "@/utils/constants";
import { useUserStore } from "@/store/userStore";
import { TokenInfo } from "@/hooks/useVaults";
import { useTxDialog, getErrorMessage } from "@/components/TxResultDialog";
import { useUserVaultBalances } from "@/hooks/useUserVaultBalances";

const erc20Abi = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  10: "Optimism",
  137: "Polygon",
  42161: "Arbitrum",
  8453: "Base",
  11155111: "Sepolia",
};

interface DepositFormProps {
  vault?: {
    id: number;
    name: string;
    managerLabel: string;
    address: string;
    apyValue: string;
    ageValue: string;
    tvl: string;
    capacity: string;
    deposit_token: TokenInfo;
    raw: {
      id: number;
      name: string;
      manager: string;
      apy_90d: string;
      tvl_wei: string;
      createdAt: string;
      deposit_asset?: string;
      chain_id?: number;
      managerRef?: { id: number; name: string | null; address: string };
    };
  };
}

const DepositForm: React.FC<DepositFormProps> = ({ vault }) => {
  const { Dialog, openSuccess, openError } = useTxDialog();

  const [amount, setAmount] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [busy, setBusy] = useState<
    "idle" | "signing" | "pending" | "notifying" | "switching"
  >("idle");

  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { chains, switchChainAsync } = useSwitchChain();

  const userId = useUserStore((s) => s.id);

  // Get user's staked balance in the vault
  const { getVaultAmount, loading: balanceLoading } = useUserVaultBalances({
    address: userAddress,
    nonzero: true,
  });

  const token = vault?.deposit_token || {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logo: undefined,
    address: "" as `0x${string}`,
  };

  const vaultChainId = vault?.raw.chain_id || chainId;
  const targetChain = chains.find((c) => c.id === vaultChainId);
  const targetChainName =
    targetChain?.name ?? CHAIN_NAMES[vaultChainId] ?? `Chain ${vaultChainId}`;
  const wrongChain = isConnected && !!vault && chainId !== vaultChainId;

  // Get staked balance for this vault
  const stakedBalance = vault ? getVaultAmount(vault.id) : "0.00";

  // Calculate new balance after deposit
  const newBalance = useMemo(() => {
    if (!amount || !stakedBalance) return null;
    try {
      const currentBalance = parseFloat(stakedBalance);
      const depositAmount = parseFloat(amount);
      if (isNaN(depositAmount) || depositAmount <= 0) return null;
      return currentBalance + depositAmount;
    } catch {
      return null;
    }
  }, [amount, stakedBalance]);

  // Check if amount exceeds balance
  const amountExceedsBalance = useMemo(() => {
    if (!amount || !userBalance || !isConnected || wrongChain) return false;
    try {
      const amountValue = parseFloat(amount);
      const balanceValue = parseFloat(userBalance);
      return amountValue > balanceValue;
    } catch {
      return false;
    }
  }, [amount, userBalance, isConnected, wrongChain]);

  const handleMaxClick = (maxAmount: string) => {
    setAmount(maxAmount);
    setUserBalance(maxAmount);
  };

  const handleSwitch = async () => {
    if (!vault) return;
    try {
      setBusy("switching");
      await switchChainAsync({ chainId: vaultChainId });
    } catch (e) {
      openError({
        title: "Switch network failed",
        message: getErrorMessage(e),
      });
    } finally {
      setBusy("idle");
    }
  };

  const { sendTransactionAsync } = useSendTransaction();

  // Helper function to determine if token is NATIVE ETH (not WETH)
  const isNativeETH = (tokenSymbol: string, tokenAddress: string) => {
    // Only return true for actual native ETH, not WETH
    return (
      tokenSymbol === "ETH" &&
      (tokenAddress === "ETH" ||
        tokenAddress === "0x0000000000000000000000000000000000000000" ||
        !tokenAddress)
    ); // Empty/undefined address means native ETH
  };

  const handleDeposit = async () => {
    if (!vault || !isConnected || !userAddress) return;
    if (!amount || Number(amount) <= 0) return;
    if (amountExceedsBalance) return;

    if (wrongChain) return handleSwitch();

    try {
      setBusy("signing");
      const value = parseUnits(amount, token.decimals);
      const isNative = isNativeETH(token.symbol, token.address);

      console.log("Deposit Debug:", {
        tokenSymbol: token.symbol,
        tokenAddress: token.address,
        isNative,
        vaultAddress: vault.address,
        amount,
        value: value.toString(),
      });

      let hash: `0x${string}`;

      if (isNative) {
        // For NATIVE ETH ONLY - send ETH directly to vault address
        console.log("Using sendTransaction for native ETH");
        hash = await sendTransactionAsync({
          to: vault.address as `0x${string}`,
          value: value,
          chainId: vaultChainId,
        });
      } else {
        // For ALL ERC-20 tokens (including WETH, USDC, etc.)
        console.log("Using writeContract for ERC-20 token:", token.symbol);
        hash = await writeContractAsync({
          abi: erc20Abi,
          address: token.address as `0x${string}`,
          functionName: "transfer",
          args: [vault.address as `0x${string}`, value],
          chainId: vaultChainId,
        });
      }

      setBusy("pending");
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });
      const firstLogIndex = receipt.logs?.[0]?.logIndex ?? 0;

      setBusy("notifying");
      await axios.post(`${BACKEND_URL}/api/deposit/notify`, {
        user_address: userAddress,
        user_id: userId ?? null,
        vault_id: vault.id,
        chain_id: vaultChainId,
        asset: isNative
          ? "0x0000000000000000000000000000000000000000"
          : token.address,
        tx_hash: hash,
        log_index: firstLogIndex,
        amount_wei: value.toString(),
        status: "pending",
      });

      setBusy("idle");
      setAmount("");

      openSuccess({
        title: "Deposit submitted",
        message: `You deposited ${amount} ${token.symbol} to ${vault.name}.`,
        txHash: hash,
        chainId: vaultChainId,
      });
    } catch (e) {
      console.error("Deposit error:", e);
      openError({
        title: "Deposit failed",
        message: getErrorMessage(e),
      });
      setBusy("idle");
    }
  };

  // Check if deposit button should be disabled
  const isDepositDisabled =
    !amount ||
    parseFloat(amount) <= 0 ||
    busy !== "idle" ||
    amountExceedsBalance;

  return (
    <>
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
          Deposited funds are subject to a 1 day redemption period
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
              <MaxButton
                tokenAddress={token.address}
                onMaxClick={handleMaxClick}
                showMaxButton={true}
                tokenSymbol={token.symbol}
                onBalanceUpdate={setUserBalance}
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
                )}
                <Typography
                  sx={{ typography: { xs: "body2", md: "h5" }, color: "white" }}
                  className="font-medium"
                >
                  {token.symbol}
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
                    color: amountExceedsBalance ? "error.main" : "white",
                    typography: { xs: "body1", sm: "h5" },
                    "& input": { textAlign: "right", padding: 0 },
                    "& input::placeholder": { color: "gray.500", opacity: 1 },
                  },
                }}
                sx={{ flexGrow: 1 }}
              />
            </div>

            {/* Error message for insufficient balance */}
            {amountExceedsBalance && (
              <div className="mt-2 text-right">
                <Typography
                  sx={{
                    typography: "caption",
                    color: "error.main",
                  }}
                >
                  Insufficient balance
                </Typography>
              </div>
            )}
          </Box>
        </GradientCard>

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
                      color: "#64b5f6",
                      fontSize: "14px",
                      mx: 1,
                    }}
                  >
                    →
                  </Typography>
                  <Typography
                    sx={{
                      typography: { xs: "body2", sm: "h6" },
                      color: "#64b5f6",
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

        {/* Connect / Switch / Deposit */}
        {!isConnected ? (
          <ConnectButton fullWidth label="🔗 Connect" />
        ) : wrongChain ? (
          <Button
            variant="contained"
            fullWidth
            onClick={handleSwitch}
            disabled={busy !== "idle" && busy !== "switching"}
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
            {busy === "switching" ? (
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
            variant="gradient"
            fullWidth
            onClick={handleDeposit}
            disabled={isDepositDisabled}
            sx={{
              background: "gradients.primary",
              color: "white",
              fontSize: "16px",
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
            {busy === "signing" ||
            busy === "pending" ||
            busy === "notifying" ? (
              <>
                <CircularProgress size={18} sx={{ mr: 1, color: "inherit" }} />
                {busy === "signing"
                  ? "Confirm in wallet…"
                  : busy === "pending"
                  ? "Waiting for confirmation…"
                  : "Finalizing…"}
              </>
            ) : (
              `Deposit ${amount ? `${amount} ${token.symbol}` : token.symbol}`
            )}
          </Button>
        )}
      </div>

      {/* success/error modal */}
      {Dialog}
    </>
  );
};

export default DepositForm;
