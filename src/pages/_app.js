import PageContent from "@/components/pageContent";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure this import is in _app.js

import "../styles/globals.css"; // Ensure this path is correct
import { showSuccessToastMessage } from "@/components/@core/Layout/notifySuccess";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <PageContent>
        <ToastContainer />

        <Component {...pageProps} />
      </PageContent>
    </SessionProvider>
  );
}
