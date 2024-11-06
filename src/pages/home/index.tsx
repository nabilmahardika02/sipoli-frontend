import HomeNonPasienView from "@/components/fragments/Home/HomeNonPasienView";
import HomePasienView from "@/components/fragments/Home/HomePasienView";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import useAuthStore from "@/store/useAuthStore";
import Head from "next/head";
import { useEffect } from "react";

const HomePage = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Beranda");
  }, [setTitle]);

  return (
    <main className="w-full flex flex-col items-center justify-center">
      <Head>
        <title>SIPOLI</title>
      </Head>
      {user?.role === "PASIEN" ? <HomePasienView /> : <HomeNonPasienView />}
    </main>
  );
};

export default withAuth(HomePage, "user");
