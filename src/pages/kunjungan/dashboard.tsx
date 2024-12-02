import StatisticJumlahKunjugan from "@/components/fragments/dashboard/StatisticJumlahKunjungan";
import StatisticJumlahPasien from "@/components/fragments/dashboard/StatisticJumlahPasien";
import StatisticRecentKunjungan from "@/components/fragments/dashboard/StatisticRecentKunjungan";
import StatisticRujukan from "@/components/fragments/dashboard/StatisticRujukan";
import StatisticSesi from "@/components/fragments/dashboard/StatisticSesi";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DashboardKunjunganPage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Statistik Data Kunjungan");
  }, [setTitle]);

  const router = useRouter();
  if (!checkRole(["DOKTER", "PERAWAT", "OPERATOR"])) {
    router.push("/403");
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <Head>
        <title>Dashboard Kunjungan</title>
      </Head>
      <StatisticRecentKunjungan className="md:col-span-2" />
      <StatisticJumlahKunjugan className="md:col-span-2" />
      <StatisticSesi />
      <StatisticRujukan />
      <StatisticJumlahPasien className="md:col-span-2" />
    </main>
  );
};

export default withAuth(DashboardKunjunganPage, "user");
