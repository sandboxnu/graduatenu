import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useEffect,
} from "react";
import { ChakraProvider, Flex, Heading, Image, Text } from "@chakra-ui/react";
import "@fontsource/montserrat-alternates";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ErrorBoundary, GraduateDisabledAppHeader } from "../components";
import { useWindowSize } from "../hooks";
import { theme } from "../utils";
import { ClientSideError } from "../components/Error/ClientSideError";
import { Analytics } from "@vercel/analytics/react";

interface IsGuestContextType {
  isGuest: boolean;
  setIsGuest: Dispatch<SetStateAction<boolean>>;
}

export const IsGuestContext = createContext<IsGuestContextType>({
  isGuest: false,
  setIsGuest: () => undefined,
});

interface NewPlanModalContextType {
  isNewPlanModalOpen: boolean;
  setIsNewPlanModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const NewPlanModalContext = createContext<NewPlanModalContextType>({
  isNewPlanModalOpen: false,
  setIsNewPlanModalOpen: () => undefined,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { width } = useWindowSize();

  const isLandingPage = router.asPath === "/";
  const disableApp = !isLandingPage && width && width <= 1100;
  const [isGuest, setIsGuest] = useState(false);

  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);

  // keyboard shortcut for new plan (ctrl+shift+n)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !isLandingPage &&
        !disableApp &&
        event.ctrlKey &&
        event.shiftKey &&
        event.key === "N"
      ) {
        console.log("Shortcut triggered!");
        event.preventDefault();
        setIsNewPlanModalOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLandingPage, disableApp]);

  return (
    <>
      <ErrorBoundary fallback={ClientSideError}>
        <Head>
          <title>GraduateNU</title>
          <meta
            name="description"
            content="A degree scheduling service for Northeastern Students."
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
        </Head>
        <ChakraProvider theme={theme}>
          <IsGuestContext.Provider value={{ isGuest, setIsGuest }}>
            <NewPlanModalContext.Provider
              value={{ isNewPlanModalOpen, setIsNewPlanModalOpen }}
            >
              {disableApp ? <DisabledApp /> : <Component {...pageProps} />}
            </NewPlanModalContext.Provider>
          </IsGuestContext.Provider>
        </ChakraProvider>
        <ToastContainer position="bottom-right" />
      </ErrorBoundary>
      <Analytics />
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
