import Head from "next/head";
import type { AppProps } from "next/app";
import { ChakraProvider, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { theme } from "../utils";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary, GraduateDisabledAppHeader } from "../components";
import "@fontsource/montserrat-alternates";
import { useWindowSize } from "../hooks";

function MyApp({ Component, pageProps }: AppProps) {
  const { width } = useWindowSize();

  const disableApp = width && width <= 1100;

  return (
    <>
      <Head>
        <title>GraduateNU</title>
        <meta
          name="description"
          content="A degree scheduling service for Northeastern Students."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </Head>
      <ErrorBoundary>
        <ChakraProvider theme={theme}>
          {disableApp ? <DisabledApp /> : <Component {...pageProps} />}
        </ChakraProvider>
      </ErrorBoundary>
      <ToastContainer position="bottom-right" />
    </>
  );
}

const DisabledApp: React.FC = () => {
  return (
    <Flex flexDirection="column" height="100vh" overflow="hidden">
      <GraduateDisabledAppHeader />
      <Flex
        height="100%"
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          shadow="2xl"
          borderRadius="2xl"
          width={{ tablet: "md", base: "xs" }}
          height={{ tablet: "md", base: "xs" }}
          direction="column"
          alignItems="center"
          rowGap="md"
          p={{ tablet: "2xl", base: "md" }}
        >
          <Image src="/sad_face.svg" alt="sad face" boxSize="7rem" />
          <Heading as="h1" size="xl" color="primary.blue.dark.main">
            Device Too Small
          </Heading>
          <Text size="xs" textAlign="center">
            Sorry! We unfortunately do not support tablets or mobile devices
            yet, but we are working hard to do so.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MyApp;
