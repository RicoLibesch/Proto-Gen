import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./Layout";
import { createTheme, ThemeProvider } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
  // set theme for mui
  const theme = createTheme({
    palette: {
      primary: {
        main: "#2E5A66",
      },
      
    },
    typography(palette) {
      return {
        button: {
          textTransform: "none",
          fontWeight: "inherit"
        }
      }
    },
  });

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Layout>
  );
}
