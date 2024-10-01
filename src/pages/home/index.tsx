import Button from "@/components/elements/Button";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { removeToken } from "@/lib/cookies";
import useAuthStore from "@/store/useAuthStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GoPlus } from "react-icons/go";
import Link from "next/link";

const HomePage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  const logout = useAuthStore.useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    removeToken();

    router.push("/login");
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <Head>
        <title>SIPOLI</title>
      </Head>

      <Link href={"/kunjungan/add"}>
        <Button leftIcon={GoPlus}>Daftar Kunjungan</Button>
      </Link>
      <Button className="mt-5" onClick={handleLogout}>
        Logout
      </Button>
    </main>
  );
};

export default withAuth(HomePage, "user");
