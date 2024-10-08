import Button from "@/components/elements/Button";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Obat } from "@/types/entities/obat";
import { obatTableColumn } from "@/types/table/obatColumn";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { RiMedicineBottleFill } from "react-icons/ri";

const ObatPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const router = useRouter();

  const [listObat, setListObat] = useState<Obat[]>();

  useEffect(() => {
    setTitle("Daftar Obat");
  }, [setTitle]);

  if (!checkRole(["OPERATOR", "DOKTER", "PERAWAT"])) {
    router.push("/403");
  }

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/all"
      );

      if (isSuccess) {
        setListObat(responseData as Obat[]);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <Head>
        <title>Daftar Obat</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden">
        Daftar Obat
      </Typography>
      {user?.role === "OPERATOR" && (
        <div className="w-full flex items-center justify-start md:justify-end gap-4">
          <Link href={"/obat/tambah"}>
            <Button leftIcon={GoPlus}>Tambah Obat</Button>
          </Link>
          <Link href={"/obat/restok"}>
            <Button leftIcon={RiMedicineBottleFill}>Restok</Button>
          </Link>
        </div>
      )}
      <Head>Daftar Obat</Head>
      <section className="mt-5">
        {listObat ? (
          <DataTable columns={obatTableColumn} rows={listObat} />
        ) : (
          <LoadingDiv />
        )}
      </section>
    </main>
  );
};

export default withAuth(ObatPage, "user");