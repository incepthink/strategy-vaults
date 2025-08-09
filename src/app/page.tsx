import FooterMain from "@/components/landing/FooterMain";
import InfoCardsOne from "@/components/landing/InfoCardsOne";
import InfoCardsTwo from "@/components/landing/InfoCardsTwo";
import LandingHome from "@/components/landing/LandingHome";
import ProductForm from "@/components/landing/ProductForm";
import SecondaryDisplay from "@/components/landing/SecondaryDisplay";
import { Box, Container } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-screen overflow-hidden">
      <LandingHome />
      <Box
        sx={{ backgroundColor: "secondary.main", color: "secondary.dark" }}
        className="p-4 sm:p-8 lg:p-12 flex flex-col gap-12 sm:gap-20 lg:gap-28"
      >
        <InfoCardsOne />
        <InfoCardsTwo />
      </Box>
      <SecondaryDisplay />
      <ProductForm />
      <FooterMain />
    </div>
  );
}
