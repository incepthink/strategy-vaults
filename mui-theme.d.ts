// mui-theme.d.ts (Place this at your project root or in src/)
import "@mui/material/styles";
import { ButtonPropsVariantOverrides } from "@mui/material/Button";
import { CardPropsVariantOverrides } from "@mui/material/Card";
import { PaperPropsVariantOverrides } from "@mui/material/Paper";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    gradient: true;
  }
}

declare module "@mui/material/Card" {
  interface CardPropsVariantOverrides {
    gradient: true;
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    card: Palette["primary"];
  }
  interface PaletteOptions {
    card?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    gradient: true;
  }
}

declare module "@mui/material/styles" {
  interface Theme {
    gradients: {
      primary: string;
      red: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    gradients?: {
      primary?: string;
      red?: string;
    };
  }
}
