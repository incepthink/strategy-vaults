// hooks/useUserVaultBalances.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";
import { useAccount } from "wagmi";

/** Backend response types */
export type BalanceRow = {
  vault_id: number;
  chain_id: number;
  asset: string; // token address (lowercased)
  amount_wei: string; // DECIMAL(65,0) as string
  vault?: {
    id: number;
    name: string;
    chain_id: number;
    deposit_asset: string; // same as asset usually
    manager_id: number | null;
    manager: string;
  };
};

export type AddressBalancesResponse = {
  address: string;
  user_id: number | null;
  count: number;
  balances: BalanceRow[];
};

type Params = {
  address?: `0x${string}`;
  nonzero?: boolean;
};

/** ---- Token info (decimals) lookup ----
 *  Replace/extend this with your real token registry when ready.
 */
type TokenInfo = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
};
const TOKEN_DECIMALS: Record<string, number> = {
  // ETH mainnet examples
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 6, // USDC
  "0xdac17f958d2ee523a2206206994597c13d831ec7": 6, // USDT
  "0x6b175474e89094c44da98b954eedeac495271d0f": 18, // DAI
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 18, // WETH
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": 8, // WBTC
};
const getDecimals = (addr?: string) =>
  addr ? TOKEN_DECIMALS[addr.toLowerCase()] ?? 18 : 18;

/** BigInt-safe sum of decimal strings */
const addWei = (a: string, b: string) => (BigInt(a) + BigInt(b)).toString();

/** Format wei -> token units (string), preserving big precision */
export const formatUnits = (wei: string, decimals: number) => {
  const neg = wei.startsWith("-");
  const s = neg ? wei.slice(1) : wei;
  const pad = s.padStart(decimals + 1, "0");
  const int = pad.slice(0, -decimals) || "0";
  const frac = decimals ? pad.slice(-decimals).replace(/0+$/, "") : "";
  return (neg ? "-" : "") + (frac ? `${int}.${frac}` : int);
};

type Selected = {
  user_id: number | null;
  /** Raw rows from backend + normalized amount */
  list: (BalanceRow & { decimals: number; amount: string })[];
  /** Aggregates */
  byVaultWei: Record<number, string>;
  byVaultAmount: Record<number, string>; // normalized using the vault’s deposit_asset decimals
  byVaultAssetWei: Record<string, string>; // `${vault_id}:${asset}`
};

export function useUserVaultBalances(input?: Params) {
  const { address: wagmiAddr } = useAccount();
  const address = (input?.address ?? wagmiAddr)?.toLowerCase() as
    | `0x${string}`
    | undefined;
  const nonzero = input?.nonzero === true;

  const queryKey = ["balances:address", address, { nonzero }];

  const { data, isLoading, error, refetch } = useQuery<
    AddressBalancesResponse,
    Error,
    Selected
  >({
    queryKey,
    enabled: !!address,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const url = `${BACKEND_URL}/api/user/address/${address}/balances`;
      const { data } = await axios.get<AddressBalancesResponse>(url, {
        params: nonzero ? { nonzero: true } : undefined,
        signal,
      });
      return data;
    },
    select: (resp) => {
      const byVaultWei: Record<number, string> = {};
      const byVaultAmount: Record<number, string> = {};
      const byVaultAssetWei: Record<string, string> = {};

      // Normalize each row with decimals from its deposit_asset (row.asset)
      const list = resp.balances.map((r) => {
        const decimals = getDecimals(r.asset || r.vault?.deposit_asset);
        const amount = formatUnits(r.amount_wei, decimals);
        return { ...r, decimals, amount };
      });

      // Build aggregates per vault
      for (const r of list) {
        // sum wei per vault
        byVaultWei[r.vault_id] = addWei(
          byVaultWei[r.vault_id] ?? "0",
          r.amount_wei
        );

        // sum wei per vault+asset
        const key2 = `${r.vault_id}:${r.asset.toLowerCase()}`;
        byVaultAssetWei[key2] = addWei(
          byVaultAssetWei[key2] ?? "0",
          r.amount_wei
        );
      }

      // Convert per-vault total wei -> normalized amount using that vault’s deposit_asset decimals
      // We pick decimals from the first row for that vault (they’ll be the same deposit token).
      const seenVault: Record<number, number> = {};
      for (const r of list) {
        if (seenVault[r.vault_id] == null) {
          seenVault[r.vault_id] = r.decimals;
          const totalWei = byVaultWei[r.vault_id] ?? "0";
          byVaultAmount[r.vault_id] = formatUnits(totalWei, r.decimals);
        }
      }

      return {
        user_id: resp.user_id,
        list,
        byVaultWei,
        byVaultAmount,
        byVaultAssetWei,
      };
    },
  });

  // helpers
  const getVaultWei = (vaultId: number) => data?.byVaultWei[vaultId] ?? "0";
  const getVaultAmount = (vaultId: number) =>
    data?.byVaultAmount[vaultId] ?? "0";
  const getVaultAssetWei = (vaultId: number, asset: string) =>
    data?.byVaultAssetWei[`${vaultId}:${asset.toLowerCase()}`] ?? "0";

  return {
    // raw & normalized rows
    data: data?.list ?? [],
    userId: data?.user_id ?? null,

    // loading state
    loading: isLoading,
    error,
    refetch,

    // aggregates
    byVaultWei: data?.byVaultWei ?? {},
    byVaultAmount: data?.byVaultAmount ?? {}, // normalized per vault
    byVaultAssetWei: data?.byVaultAssetWei ?? {},

    // getters
    getVaultWei,
    getVaultAmount, // <-- normalized (string)
    getVaultAssetWei,

    // utils
    formatUnits,
  };
}
