import StatisticPemakaianObatByMonth from "@/components/fragments/dashboard/StatisticPemakaianObat";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DashboardObatPage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Statistik Data Obat");
  }, [setTitle]);

  const router = useRouter();
  if (!checkRole(["DOKTER", "PERAWAT", "OPERATOR"])) {
    router.push("/403");
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <Head>
        <title>Dashboard Obat</title>
      </Head>
      <StatisticPemakaianObatByMonth className="md:col-span-2" />
    </main>
  );
};

export default withAuth(DashboardObatPage, "user");
