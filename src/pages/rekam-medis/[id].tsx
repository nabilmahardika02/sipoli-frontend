import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import IconButton from "@/components/elements/IconButton";
import DataHasilPemeriksaan from "@/components/fragments/kunjungan/DataHasilPemeriksaan";
import DataKunjungan from "@/components/fragments/kunjungan/DataKunjungan";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import ModalLayout from "@/components/layouts/ModalLayout";
import { Kunjungan } from "@/types/entities/kunjungan";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaRegFilePdf } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import RekamMedisPDF from "@/components/PDF/RekamMedisPDF";

const KunjunganPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const user = useAuthStore.useUser();
  const [trigger, setTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <main className="flex flex-col gap-5">
      <Head>
        <title>Detail Kunjungan</title>
      </Head>
      {kunjungan ? (
        <>
          <section className=" bg-white">
            <div className="flex justify-center md:justify-between gap-2 my-2">
              <div className="flex justify-start">
                <Typography variant="h6" className="text-primary-1">
                  Detail Kunjungan
                </Typography>
              </div>
              <div className="flex justify-end gap-2">
                <Link href={`/pasien/detail/${kunjungan.profile.id}`}>
                  <Button variant="primary">Detail Pasien</Button>
                </Link>
                {kunjungan.profile.noRekamMedis && (
                  <Button
                  variant="outline"
                  leftIcon={FaRegFilePdf}
                  onClick={() => setShowModal(true)}
                >
                  Unduh Rekam Medis
                </Button>
                )}
              </div>
            </div>
            <Divider weight="kurus" />
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
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between">
              <Typography variant="h6" className="text-primary-1">
                Unduh Rekam Medis
              </Typography>
              <IconButton
                variant="outline"
                onClick={() => handleCloseModal()}
                icon={RxCross2}
                fullRounded
              ></IconButton>
            </div>
            <Divider />
            <RekamMedisPDF
              kunjungan={kunjungan}
            />
          </div>
        </ModalLayout>
      )}
    </main>
  );
};

export default withAuth(KunjunganPage, "user");
