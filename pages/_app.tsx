import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    });
  }, []);

  return (
    <>
      <Head>
        <title>Licious Haya - AI Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Licious Haya - Your AI assistant for fresh premium meat, fish, and food delivery with intelligent product recommendations" />
        <meta name="theme-color" content="#E21D24" />
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/assist-442ec.firebasestorage.app/o/haya-logo.png?alt=media&token=11f0c5d3-e818-4e7f-b612-4ddc29f0b9cf" type="image/png" />
        <link rel="apple-touch-icon" href="https://firebasestorage.googleapis.com/v0/b/assist-442ec.firebasestorage.app/o/haya-logo.png?alt=media&token=11f0c5d3-e818-4e7f-b612-4ddc29f0b9cf" />
        <meta name="theme-color" content="#E21D24" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
