import "react-toastify/dist/ReactToastify.min.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "../components";

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
        <Component {...pageProps} />
      </ErrorBoundary>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default MyApp;
