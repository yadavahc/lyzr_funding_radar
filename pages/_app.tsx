import type { AppProps } from "next/app";
import Head from "next/head";
import "./globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AI Funding Radar - Track AI Startup Funding</title>
        <meta
          name="description"
          content="Discover, extract, and analyze recently funded AI developer tool startups"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
