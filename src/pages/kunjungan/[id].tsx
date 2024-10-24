import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import DataHasilPemeriksaan from "@/components/fragments/kunjungan/DataHasilPemeriksaan";
import DataKunjungan from "@/components/fragments/kunjungan/DataKunjungan";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Kunjungan } from "@/types/entities/kunjungan";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";

const KunjunganPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const user = useAuthStore.useUser();

  useEffect(() => {
    setTitle("Detail Kunjungan");
  }, [setTitle]);

  useEffect(() => {
    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan?id=" + router.query.id
      );

      console.log(responseData);

      if (isSuccess) {
        setKunjungan(responseData as Kunjungan);
      }
    };

    fetchKunjungan();
  }, []);

  return (
    <main className="flex flex-col gap-5">
      <Head>
        <title>Detail Kunjungan</title>
      </Head>
      {kunjungan ? (
        <>
          <section className="p-5 md:px-7 rounded-xl bg-white border border-gray-200 shadow-md">
            <Typography
              variant="h4"
              className="text-primary-1 md:hidden text-center mx-auto"
            >
              Detail Kunjungan
            </Typography>
            <div className="flex justify-center md:justify-end gap-2 my-2">
              {user?.role !== "PASIEN" && (
                <div className="flex justify-end">
                  <Link href={"/pasien/" + kunjungan?.profile.id}>
                    <Button variant="primary">Detail Pasien</Button>
                  </Link>
                </div>
              )}
              {user?.role === "PASIEN" && kunjungan.status === 0 && (
                <div className="flex justify-end">
                  <Link href={`/kunjungan/update/${kunjungan.id}`}>
                    <Button variant="secondary" leftIcon={LuPencil}>
                      Edit Data Kunjungan
                    </Button>
                  </Link>
                </div>
              )}
              {user?.role !== "PASIEN" && kunjungan.status < 2 && (
                <div className="flex justify-end">
                  <Link href={`/kunjungan/update/${kunjungan.id}`}>
                    <Button variant="secondary" leftIcon={LuPencil}>
                      Edit Data Kunjungan
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            <Divider className="md:hidden my-2" />
            <DataKunjungan kunjungan={kunjungan} />
          </section>

          <section className="p-5 md:px-7 rounded-xl bg-white border border-gray-200 shadow-md">
            <Typography variant="h6" className="text-primary-1">
              Hasil Pemeriksaan
            </Typography>
            <Divider />
            {user?.role !== "PASIEN" && kunjungan.hasilPemeriksaan == null ? (
              <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
                <Link
                  href={"/kunjungan/hasil-pemeriksaan/tambah/" + kunjungan.id}
                  className="flex flex-col items-center group"
                >
                  <FaCirclePlus className="text-gray-400 text-3xl group-hover:text-gray-500" />
                  <Typography
                    variant="h7"
                    className="text-gray-400 mt-4 group-hover:text-gray-500"
                  >
                    Tambah Hasil Pemeriksaan
                  </Typography>
                </Link>
              </div>
            ) : (
              <DataHasilPemeriksaan data={kunjungan.hasilPemeriksaan} />
            )}
          </section>
        </>
      ) : (
        <LoadingDiv />
      )}
    </main>
  );
};

export default withAuth(KunjunganPage, "user");
