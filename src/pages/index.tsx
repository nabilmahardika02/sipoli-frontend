import LoadingPage from "@/components/fragments/LoadingPage";
import withAuth from "@/components/hoc/withAuth";
import useAuthStore from "@/store/useAuthStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const user = useAuthStore.useUser();
  const isAuthenticated = useAuthStore.useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <Head>
        <title>SIPOLI</title>
      </Head>
      <LoadingPage />
    </main>
  );
};

export default withAuth(Home, "user");
