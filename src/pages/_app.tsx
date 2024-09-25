import Toast from "@/components/elements/Toast";
import AppShell from "@/components/layouts/AppShell";
import DocumentTitleProvider from "@/context/Title";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DocumentTitleProvider>
      <Toast />
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </DocumentTitleProvider>
  );
}
