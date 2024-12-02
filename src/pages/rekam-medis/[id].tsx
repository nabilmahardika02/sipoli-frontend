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

const KunjunganPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const user = useAuthStore.useUser();
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    setTitle("Detail Rekam Medis");
  }, [setTitle]);

  useEffect(() => {
    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `/kunjungan?id=${router.query.id}`
      );

      if (isSuccess) {
        setKunjungan(responseData as Kunjungan);
      }
    };

    if (router.query.id) {
      fetchKunjungan();
    }
  }, [trigger, router.query.id]);

  return (
    <main className="flex flex-col gap-5">
      <Head>
        <title>Detail Kunjungan</title>
      </Head>
      {kunjungan ? (
        <>
          <section className=" bg-white">
            <div className="flex justify-between items-center">
              <Typography variant="h6" className="text-primary-1">
                Detail Kunjungan
              </Typography>
              {user?.role === "PASIEN" && (
                <Link href={`/pasien/detail/${kunjungan.profile.id}`}>
                  <Button variant="primary">Detail Pasien</Button>
                </Link>
              )}
            </div>
            <Divider />
            <DataKunjungan kunjungan={kunjungan} />
          </section>

          {user?.role !== "OPERATOR" && (
            <section className="bg-white mt-4">
              <Typography variant="h6" className="text-primary-1">
                Hasil Pemeriksaan
              </Typography>
              <Divider />
              {(user?.role === "DOKTER" || user?.role === "PERAWAT") &&
              !kunjungan.hasilPemeriksaan &&
              kunjungan.status < 3 ? (
                <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
                <Typography
                  variant="h7"
                  className="text-gray-400 mt-2 mb-2 group-hover:text-gray-500"
                >
                  Belum Ada Hasil Pemeriksaan
                </Typography>
              </div>
              ) : (
                <DataHasilPemeriksaan
                  data={kunjungan.hasilPemeriksaan}
                  trigger={trigger}
                  setTrigger={setTrigger}
                />
              )}
            </section>
          )}
        </>
      ) : (
        <LoadingDiv />
      )}
    </main>
  );
};

export default withAuth(KunjunganPage, "user");
