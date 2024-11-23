import StatisticJumlahKunjugan from "@/components/fragments/dashboard/StatisticJumlahKunjungan";
import StatisticJumlahPasien from "@/components/fragments/dashboard/StatisticJumlahPasien";
import withAuth from "@/components/hoc/withAuth";
import { checkRole } from "@/lib/checkRole";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();
  if (!checkRole(["DOKTER", "PERAWAT", "OPERATOR"])) {
    router.push("/403");
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <StatisticJumlahKunjugan className="md:col-span-2" />
      <StatisticJumlahPasien className="md:col-span-2" />
    </main>
  );
};

export default withAuth(DashboardPage, "user");
