import PageContent from "@/components/pageContent";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

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
