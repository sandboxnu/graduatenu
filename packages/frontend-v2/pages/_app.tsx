import Head from "next/head";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../utils";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "../components";
import "@fontsource/montserrat-alternates";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GraduateNU</title>
        <meta
          name="description"
          content="A degree scheduling service for Northeastern Students."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </ErrorBoundary>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default MyApp;
