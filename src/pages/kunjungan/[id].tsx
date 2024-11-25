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
import { FaRegFilePdf } from "react-icons/fa";
import ModalLayout from "@/components/layouts/ModalLayout";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SuratIzinForm } from "@/types/forms/suratIzinForm";
import Input from "@/components/elements/forms/Input";
import { SuratIzin } from "@/types/entities/suratIzin";

const KunjunganPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const user = useAuthStore.useUser();
  const [trigger, setTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suratIzin, setSuratIzin] = useState<SuratIzin | null>(null);

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

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<SuratIzinForm> = (data) => {
    const postData = async () => {
      const payload = {
        ...data,
        kunjunganId: router.query.id, // Ambil kunjunganId langsung dari router.query.id
      };
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        `surat-izin/add`,
        payload,
        true
      );

      if (isSuccess) {
        setShowModal(false);
        methods.reset();
        setTrigger(!trigger);
        setSuratIzin(responseData as SuratIzin);
      }
    };

    postData();
  };

  useEffect(() => {
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

    fetchSuratIzin();
  }, [router.query.id]);

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
              {(user?.role === "DOKTER" || user?.role === "PERAWAT") && (
                <div className="flex justify-end">
                  <Link href={`/pasien/detail/${kunjungan.profile.id}`}>
                    <Button variant="primary">Detail Pasien</Button>
                  </Link>
                </div>
              )}
              {user?.role === "PASIEN" && kunjungan.status === 0 && (
                <div className="flex justify-end">
                  <Link href={`/kunjungan/update/${kunjungan.id}`}>
                    <Button variant="secondary" leftIcon={LuPencil}>
                      Ubah Data Kunjungan
                    </Button>
                  </Link>
                </div>
              )}
              {user?.role !== "PASIEN" && kunjungan.status < 2 && (
                <div className="flex justify-end">
                  <Link href={`/kunjungan/update/${kunjungan.id}`}>
                    <Button variant="secondary" leftIcon={LuPencil}>
                      Ubah Data Kunjungan
                    </Button>
                  </Link>
                </div>
              )}
              {(user?.role === "PERAWAT" || user?.role === "DOKTER") &&
                kunjungan.hasilPemeriksaan !== null &&
                suratIzin === null && (
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
                    <Link href={`/surat-izin/${suratIzin.id}`}>
                    <Button
                      variant="outline"
                      leftIcon={FaRegFilePdf}
                    >
                      Unduh Surat Izin
                    </Button>
                    </Link>
                    
                  </div>
                )}
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
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Buat Surat Izin
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    type="date"
                    id="tanggalAwal"
                    label="Tanggal Awal Istirahat"
                  />
                  <Input
                    type="date"
                    id="tanggalAkhir"
                    label="Tanggal Berakhir Istirahat"
                  />
                </div>
                <div className="flex justify-end">
                <Button type="submit" className="max-md:w-full">
                  Unduh
                </Button>
                </div>
                
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </main>
  );
};

export default withAuth(KunjunganPage, "user");
