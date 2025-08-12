"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { parseUnits } from "viem";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";
import { useUserStore } from "@/store/userStore";
import { useUserVaultBalances } from "./useUserVaultBalances";

export type WithdrawalRequest = {
  user_id: number;
  user_address: `0x${string}`;
  vault_id: number;
  chain_id: number;
  asset: `0x${string}`;
  amount_wei: string;
};

export type WithdrawalResponse = {
  tx_hash: string;
  withdrawal: {
    id: number;
    user_id: number;
    vault_id: number;
    chain_id: number;
    asset: string;
    tx_hash: string;
    log_index: number;
    amount_wei: string;
    status: string;
    block_number: number;
  };
};

export type WithdrawalError = {
  error: string;
  message?: string;
};

export function useWithdrawal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();

  // Get user info from store
  const userId = useUserStore((s) => s.id);
  const userStoreAddress = useUserStore((s) => s.address);
  const userVerified = useUserStore((s) => s.verified);

  // Get balance checking functions
  const {
    getVaultAmount,
    getVaultWei,
    refetch: refetchBalances,
  } = useUserVaultBalances({
    address: userAddress,
    nonzero: true,
  });

  const requestWithdrawal = async ({
    vaultId,
    amount,
    tokenAddress,
    tokenDecimals,
    vaultChainId,
  }: {
    vaultId: number;
    amount: string;
    tokenAddress: string;
    tokenDecimals: number;
    vaultChainId?: number;
  }): Promise<WithdrawalResponse> => {
    // Validation checks
    if (!isConnected || !userAddress) {
      throw new Error("Wallet not connected");
    }

    if (!userId || !userVerified) {
      throw new Error("User not verified");
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error("Invalid amount");
    }

    // Check if on correct chain
    const targetChainId = vaultChainId || chainId;
    if (chainId !== targetChainId) {
      throw new Error(`Please switch to chain ${targetChainId}`);
    }

    // Convert amount to wei
    const amountWei = parseUnits(amount, tokenDecimals);

    // Get current balance in wei for this vault
    const currentBalanceWei = BigInt(getVaultWei(vaultId));

    // Check if user has sufficient balance
    if (amountWei > currentBalanceWei) {
      const currentBalance = getVaultAmount(vaultId);
      throw new Error(
        `Insufficient balance. Available: ${currentBalance}, Requested: ${amount}`
      );
    }

    setLoading(true);
    setError(null);

    try {
      const requestData: WithdrawalRequest = {
        user_id: userId,
        user_address: userAddress,
        vault_id: vaultId,
        chain_id: targetChainId,
        asset: tokenAddress.toLowerCase() as `0x${string}`,
        amount_wei: amountWei.toString(),
      };

      const response = await axios.post<WithdrawalResponse>(
        `${BACKEND_URL}/api/withdrawal/request`,
        requestData
      );

      // Refetch balances after successful withdrawal
      await refetchBalances();

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Withdrawal request failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateWithdrawal = ({
    vaultId,
    amount,
    tokenDecimals,
  }: {
    vaultId: number;
    amount: string;
    tokenDecimals: number;
  }): { isValid: boolean; error?: string } => {
    if (!isConnected) {
      return { isValid: false, error: "Wallet not connected" };
    }

    if (!userId || !userVerified) {
      return { isValid: false, error: "User not verified" };
    }

    if (!amount || parseFloat(amount) <= 0) {
      return { isValid: false, error: "Invalid amount" };
    }

    try {
      const amountWei = parseUnits(amount, tokenDecimals);
      const currentBalanceWei = BigInt(getVaultWei(vaultId));

      if (amountWei > currentBalanceWei) {
        const currentBalance = getVaultAmount(vaultId);
        return {
          isValid: false,
          error: `Insufficient balance. Available: ${currentBalance}, Requested: ${amount}`,
        };
      }

      return { isValid: true };
    } catch (err) {
      return { isValid: false, error: "Invalid amount format" };
    }
  };

  const clearError = () => setError(null);

  return {
    requestWithdrawal,
    validateWithdrawal,
    loading,
    error,
    clearError,
    // Helper getters
    isConnected,
    userVerified,
    getVaultAmount,
    getVaultWei,
  };
}
