import Head from "next/head";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../utils";

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
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
