import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import DataHasilPemeriksaan from "@/components/fragments/kunjungan/DataHasilPemeriksaan";
import DataKunjungan from "@/components/fragments/kunjungan/DataKunjungan";
import withAuth from "@/components/hoc/withAuth";
import ModalLayout from "@/components/layouts/ModalLayout";
import SuratIzinPDF from "@/components/PDF/SuratIzinPDF";
import { useDocumentTitle } from "@/context/Title";
import { formatDate } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Kunjungan } from "@/types/entities/kunjungan";
import { SuratIzin } from "@/types/entities/suratIzin";
import { SuratIzinForm } from "@/types/forms/suratIzinForm";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaRegFilePdf } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { BiSolidUserDetail } from "react-icons/bi";

const KunjunganPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const user = useAuthStore.useUser();
  const [trigger, setTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [suratIzin, setSuratIzin] = useState<SuratIzin | null>(null);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  useEffect(() => {
    setTitle("Detail Kunjungan");
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

  const methods = useForm<SuratIzinForm>({
    mode: "onTouched",
  });

  const fetchSuratIzin = async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      `surat-izin/kunjungan/${router.query.id}`
    );

    if (isSuccess && responseData) {
      setSuratIzin(responseData as SuratIzin);
    } else {
      setSuratIzin(null);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      fetchSuratIzin();
    }
  }, [router.query.id]);

  const handleTanggalAwal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTanggalAwal(event.target.value);
  };

  const handleTanggalAkhir = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTanggalAkhir(event.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPreview(false);
    fetchSuratIzin();
  };

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
            <div className="grid grid-cols-1 lg:flex justify-between">
              <div className="flex justify-center md:justify-end gap-2 my-2">
                {kunjungan.createdAt &&
                  kunjungan.updatedAt &&
                  new Date(kunjungan.createdAt).toISOString().slice(0, 19) !==
                    new Date(kunjungan.updatedAt)
                      .toISOString()
                      .slice(0, 19) && (
                    <Typography variant="p2" className="italic text-gray-600">
                      Terakhir diubah pada {formatDate(kunjungan.updatedAt)}
                    </Typography>
                  )}
              </div>
              <div className="flex justify-center md:justify-end gap-2 my-2">
                {(user?.role === "DOKTER" || user?.role === "PERAWAT") && (
                  <div className="flex justify-end">
                    <Link href={`/pasien/detail/${kunjungan.profile.id}`}>
                      <Button variant="primary" className="rounded-lg" size="lg" leftIcon={BiSolidUserDetail}>Detail Pasien</Button>
                    </Link>
                  </div>
                )}
                {kunjungan.status === 0 && (
                  <div className="flex justify-end">
                    <Link href={`/kunjungan/update/${kunjungan.id}`}>
                      <Button variant="secondary" size="lg" leftIcon={LuPencil}>
                        Ubah Data Kunjungan
                      </Button>
                    </Link>
                  </div>
                )}
                {(user?.role === "PERAWAT" || user?.role === "DOKTER") &&
                  kunjungan.hasilPemeriksaan !== null &&
                  suratIzin === null &&
                  kunjungan.profile.relative === 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        leftIcon={FaRegFilePdf}
                        onClick={() => setShowModal(true)}
                      >
                        Buat Surat Izin
                      </Button>
                    </div>
                  )}
                {(user?.role === "PERAWAT" || user?.role === "DOKTER") &&
                  suratIzin !== null && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        leftIcon={FaRegFilePdf}
                        onClick={() => setShowPreview(true)}
                      >
                        Unduh Surat Izin
                      </Button>
                    </div>
                  )}
              </div>
            </div>
            <Divider className="md:hidden my-2" />
            <DataKunjungan kunjungan={kunjungan} />
          </section>

          {user?.role !== "OPERATOR" && (
            <section className="p-5 md:px-7 rounded-xl bg-white border border-gray-200 shadow-md">
              <Typography variant="h6" className="text-primary-1">
                Hasil Pemeriksaan
              </Typography>
              <Divider />
              {(user?.role === "DOKTER" || user?.role === "PERAWAT") &&
              kunjungan.hasilPemeriksaan == null &&
              kunjungan.status < 3 ? (
                kunjungan.status >= 1 ? (
                  <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
                    <Link
                      href={
                        "/kunjungan/hasil-pemeriksaan/tambah/" + kunjungan.id
                      }
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
                  <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
                    <Typography
                      variant="h7"
                      className="text-gray-400 mt-4 group-hover:text-gray-500"
                    >
                      Pasien belum diperiksa
                    </Typography>
                  </div>
                )
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
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between">
              <Typography variant="h6" className="text-primary-1">
                Buat Surat Izin
              </Typography>
              <IconButton
                variant="outline"
                onClick={() => handleCloseModal()}
                icon={RxCross2}
                fullRounded
              ></IconButton>
            </div>
            <Divider />
            <FormProvider {...methods}>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    type="date"
                    id="tanggalAwal"
                    label="Tanggal Awal Istirahat"
                    onChange={handleTanggalAwal}
                  />
                  <Input
                    type="date"
                    id="tanggalAkhir"
                    label="Tanggal Berakhir Istirahat"
                    onChange={handleTanggalAkhir}
                  />
                </div>
                <SuratIzinPDF
                  tanggalAwal={tanggalAwal}
                  tanggalAkhir={tanggalAkhir}
                  kunjungan={kunjungan}
                />
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
      {showPreview && (
        <ModalLayout setShowModal={setShowPreview}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between">
              <Typography variant="h6" className="text-primary-1">
                Unduh Surat Izin
              </Typography>
              <IconButton
                variant="outline"
                onClick={() => handleCloseModal()}
                icon={RxCross2}
                fullRounded
              ></IconButton>
            </div>
            <Divider />
            <SuratIzinPDF
              tanggalAwal={suratIzin?.tanggalAwal}
              tanggalAkhir={suratIzin?.tanggalAkhir}
              kunjungan={kunjungan}
            />
          </div>
        </ModalLayout>
      )}
    </main>
  );
};

export default withAuth(KunjunganPage, "user");
