import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MuiThemeProvider from "@/providers/MuiThemeProvider";
import { Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import WagmiWalletProvider from "@/providers/WagmiWalletProvider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // pick weights as needed
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strategy Vaults",
  description: "Strategy Vaults by Hashcase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <MuiThemeProvider>
          <WagmiWalletProvider>
            <Navbar />
            {children}
          </WagmiWalletProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
