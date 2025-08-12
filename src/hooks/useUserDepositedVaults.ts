// hooks/useUserDepositedVaults.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";
import { useAccount } from "wagmi";

/** ---- Backend response types ---- */
export type DepositedVaultRow = {
  vault_id: number;
  chain_id: number;
  asset: string; // deposit token address (lowercased)
  amount_wei: string; // DECIMAL(65,0) as string (already aggregated per vault)
  vault: {
    id: number;
    name: string;
    address: string;
    chain_id: number;
    deposit_asset: string;
    manager: string;
    manager_id: number | null;
    apy_90d: string;
    tvl_wei: string;
    createdAt: string;
    managerRef?: { id: number; name: string | null; address: string } | null;
  };
};

export type DepositedVaultsResponse = {
  address: string;
  user_id: number | null;
  count: number;
  data: DepositedVaultRow[];
};

type Params = {
  address?: `0x${string}`;
  nonzero?: boolean; // default true on backend
};

/** ---- Simple token decimals registry (extend with your own) ---- */
const TOKEN_DECIMALS: Record<string, number> = {
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 6, // USDC
  "0xdac17f958d2ee523a2206206994597c13d831ec7": 6, // USDT
  "0x6b175474e89094c44da98b954eedeac495271d0f": 18, // DAI
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 18, // WETH
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": 8, // WBTC
};
const getDecimals = (addr?: string) =>
  addr ? TOKEN_DECIMALS[addr.toLowerCase()] ?? 18 : 18;

/** ---- Utils ---- */
const shortAddr = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "-");
const fmtPercent = (s?: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? `${(n * 100).toFixed(2)}%` : "-";
};
const fmtAge = (iso?: string) => {
  if (!iso) return "-";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d > 0) return `${d}d`;
  const h = Math.floor(diff / 3_600_000);
  return `${h}h`;
};
export const formatUnits = (wei: string, decimals: number) => {
  const neg = wei.startsWith("-");
  const s = neg ? wei.slice(1) : wei;
  const pad = s.padStart(decimals + 1, "0");
  const int = pad.slice(0, -decimals) || "0";
  const frac = decimals ? pad.slice(-decimals).replace(/0+$/, "") : "";
  return (neg ? "-" : "") + (frac ? `${int}.${frac}` : int);
};

/** ---- Selected shape returned by the hook ---- */
export type DepositedVaultUI = {
  vault_id: number;
  chain_id: number;
  asset: string;
  decimals: number;
  amount_wei: string;
  amount: string; // normalized (token units)
  // handy UI fields:
  name: string;
  managerLabel: string;
  apyValue: string;
  ageValue: string;
  deposit_asset: string;
  vaultAddress: string;
  raw: DepositedVaultRow;
};

type Selected = {
  user_id: number | null;
  list: DepositedVaultUI[];
  byVaultAmount: Record<number, string>; // normalized total per vault
};

export function useUserDepositedVaults(input?: Params) {
  const { address: wagmiAddr } = useAccount();
  const address = (input?.address ?? wagmiAddr)?.toLowerCase() as
    | `0x${string}`
    | undefined;
  const nonzero = input?.nonzero !== false; // default true

  const queryKey = ["depositedVaults:address", address, { nonzero }];

  const { data, isLoading, error, refetch } = useQuery<
    DepositedVaultsResponse,
    Error,
    Selected
  >({
    queryKey,
    enabled: !!address,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const url = `${BACKEND_URL}/api/users/address/${address}/vaults`;
      const { data } = await axios.get<DepositedVaultsResponse>(url, {
        params: nonzero ? { nonzero: true } : undefined,
        signal,
      });
      return data;
    },
    select: (resp) => {
      const byVaultAmount: Record<number, string> = {};
      const list: DepositedVaultUI[] = resp.data.map((row) => {
        const v = row.vault;
        const decimals = getDecimals(v.deposit_asset || row.asset);
        const amount = formatUnits(row.amount_wei, decimals);

        // aggregate normalized amount per vault
        const prev = byVaultAmount[row.vault_id];
        byVaultAmount[row.vault_id] = prev
          ? (Number(prev) + Number(amount)).toString()
          : amount;

        return {
          vault_id: row.vault_id,
          chain_id: row.chain_id,
          asset: row.asset,
          decimals,
          amount_wei: row.amount_wei,
          amount,
          name: v.name,
          managerLabel: v.managerRef?.name || shortAddr(v.manager),
          apyValue: fmtPercent(v.apy_90d),
          ageValue: fmtAge(v.createdAt),
          deposit_asset: v.deposit_asset,
          vaultAddress: v.address,
          raw: row,
        };
      });

      return { user_id: resp.user_id, list, byVaultAmount };
    },
  });

  const getVaultAmount = (vaultId: number) =>
    data?.byVaultAmount[vaultId] ?? "0";

  return {
    data: data?.list ?? [],
    userId: data?.user_id ?? null,
    loading: isLoading,
    error,
    refetch,
    byVaultAmount: data?.byVaultAmount ?? {},
    getVaultAmount, // normalized (string)
  };
}
