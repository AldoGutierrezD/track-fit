import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Track Fit</title>
                <meta name="description" content="Sistema de control de dietas y entrenamiento" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Component {...pageProps} />
        </>
    );
}
