import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
  
    <main className={beVietnamPro.className}>
      <Component {...pageProps} />
    </main>
  );
}
