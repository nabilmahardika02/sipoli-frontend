import Toast from "@/components/elements/Toast";
import AppShell from "@/components/layouts/AppShell";
import DocumentTitleProvider from "@/context/Title";
import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DocumentTitleProvider>
        <Toast />
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      </DocumentTitleProvider>
    </LocalizationProvider>
  );
}
