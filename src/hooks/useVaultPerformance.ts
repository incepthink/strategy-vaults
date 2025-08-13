// src/hooks/useVaultPerformance.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";

export type PerfMetricsRaw = {
  avg_drawdown: string | null; // e.g. "-0.123456"
  ytd: string | null; // e.g. "0.123456"
  mtd: string | null; // e.g. "0.045678"
  sharpe: string | null; // e.g. "1.234567"
  cumulative_return: string | null; // e.g. "75153.750000"
};

export type VaultPerformanceResponse = {
  vault_id: number;
  address: `0x${string}`;
  metrics: PerfMetricsRaw; // raw strings from DB
  updated_at: string; // ISO timestamp
};

export function useVaultPerformance(address?: string) {
  const addr =
    typeof address === "string"
      ? (address.toLowerCase() as `0x${string}`)
      : undefined;

  const queryKey = ["vault:performance", addr];

  const query = useQuery<VaultPerformanceResponse>({
    queryKey,
    enabled: !!addr && addr.startsWith("0x") && addr.length === 42,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const url = `${BACKEND_URL}/api/vault/address/${addr}/performance`;
      const { data } = await axios.get<VaultPerformanceResponse>(url, {
        signal,
      });
      return data; // already raw/unchanged from backend
    },
  });

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
