import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Be_Vietnam_Pro } from "next/font/google";

import { store, persistor } from "@/stores";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className={beVietnamPro.className}>
          <Component {...pageProps} />
        </main>
      </PersistGate>
    </Provider>
  );
}
