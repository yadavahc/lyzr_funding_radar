import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <Head>
        <title>AI Funding Radar - Track AI Startup Funding</title>
        <meta
          name="description"
          content="Discover, extract, and analyze recently funded AI developer tool startups"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </div>
  );
}
