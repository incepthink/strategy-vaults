// src/hooks/useVaultPerformance.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";

export type PerfMetrics = {
  max_daily_drawdown_pct: number; // e.g. -1.48
  volume_30d_usd: number; // e.g. 11500000
  fuel_earned: number; // e.g. 127997034
};

export type VaultPerformanceResponse = {
  vault_id: number;
  address: `0x${string}`;
  metrics: PerfMetrics;
  display: {
    max_daily_drawdown: string; // "-1.48%"
    volume_30d_usd: string; // "$11.5M"
    fuel_earned: string; // "127,997,034"
  };
  updated_at: string; // ISO
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
    staleTime: 5 * 60 * 1000, // match server TTL
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const url = `${BACKEND_URL}/api/vault/address/${addr}/performance`;
      const { data } = await axios.get<VaultPerformanceResponse>(url, {
        signal,
      });

      return data;
    },
  });

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
