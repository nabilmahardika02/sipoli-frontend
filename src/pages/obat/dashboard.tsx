import StatisticPemakaianByObat from "@/components/fragments/dashboard/StatisticPemakaianByObat";
import StatisticPemakaianObatByMonth from "@/components/fragments/dashboard/StatisticPemakaianObat";
import StatisticRestockPrice from "@/components/fragments/dashboard/StatisticRestockPrice";
import StatisticTopRestock from "@/components/fragments/dashboard/StatisticTopRestock";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import sendRequest from "@/lib/getApi";
import { Obat } from "@/types/entities/obat";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DashboardObatPage = () => {
  const { setTitle } = useDocumentTitle();
  const [obatList, setObatList] = useState<Obat[]>();

  useEffect(() => {
    setTitle("Statistik Data Obat");
  }, [setTitle]);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/all"
      );

      if (isSuccess) {
        setObatList(responseData as Obat[]);
      }
    };

    fetchData();
  }, []);

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
      <StatisticPemakaianByObat className="md:col-span-2" obatList={obatList} />
      <StatisticTopRestock />
      <StatisticRestockPrice obatList={obatList}/>
    </main>
  );
};

export default withAuth(DashboardObatPage, "user");
