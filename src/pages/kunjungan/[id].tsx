import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Kunjungan } from "@/types/entities/kunjungan";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";

const sesi = [
  {
    value: "1",
    text: "Sesi 1 (08:00 - 10:00 WITA)",
  },
  {
    value: "2",
    text: "Sesi 2 (10:00 - 12:00 WITA)",
  },
  {
    value: "3",
    text: "Sesi 3 (13:00 - 15:00 WITA)",
  },
  {
    value: "4",
    text: "Sesi 4 (15:00 - 16:30 WITA)",
  },
];

const status = [
  {
    value: "0",
    text: "Belum Dilayani",
  },
  {
    value: "1",
    text: "Sedang Dilayani",
  },
  {
    value: "2",
    text: "Selesai",
  },
  {
    value: "3",
    text: "Dibatalkan",
  },
];

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

      if (isSuccess) {
        setKunjungan(responseData as Kunjungan);
      }
    };

    fetchKunjungan();
  }, []);

  const getSesiText = (sesiValue: number | undefined) => {
    const sesiItem = sesi.find((item) => Number(item.value) === sesiValue);
    return sesiItem ? sesiItem.text : "Sesi tidak tersedia";
  };

  const getStatusText = (statusValue: number | undefined) => {
    const statusItem = status.find(
      (item) => Number(item.value) === statusValue
    );
    return statusItem?.text;
  };

  const getStatusColor = (statusValue: number | undefined) => {
    switch (statusValue) {
      case 0:
        return "text-red-500"; // Belum Dilayani
      case 1:
        return "text-blue-500"; // Sedang Dilayani
      case 2:
        return "text-green-500"; // Selesai
      case 3:
        return "text-gray-500"; // Dibatalkan
      default:
        return "text-gray-500"; // Default untuk status yang tidak dikenal
    }
  };

  return (
    <main>
      {kunjungan ? (
        <section>
          <div className="flex justify-end gap-2">
            {user?.role !== "PASIEN" && (
              <div className="flex justify-end">
                <Link href={"/pasien/" + kunjungan.profile.id}>
                  <Button variant="primary">Detail Pasien</Button>
                </Link>
              </div>
            )}
            {kunjungan.status === 0 && (
              <div className="flex justify-end">
                <Link href={"/home"}>
                  <Button variant="secondary" leftIcon={LuPencil}>
                    Edit Data Kunjungan
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-center md:hidden">
            <Typography variant="h4" className="text-primary-1">
              Detail Kunjungan
            </Typography>
          </div>
          <Divider className="md:hidden" />
          <div className="grid grid-cols-2 gap-5 my-5">
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Tanggal Kunjungan
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {kunjungan.tanggal
                  ? new Date(kunjungan.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Tanggal tidak tersedia"}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Status
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className={`text-primary-1 ${getStatusColor(
                  kunjungan.status
                )}`}
              >
                {getStatusText(kunjungan.status)}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Nomor Antrian
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {kunjungan.antrian.noAntrian}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Sesi
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {getSesiText(kunjungan.antrian.sesi)}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Keluhan
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {kunjungan.keluhan}
              </Typography>
            </div>
          </div>
          <Divider />
          {user?.role !== "PASIEN" && kunjungan.rekamMedis === null && (
            <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8">
              <Link href={"/"} className="flex flex-col items-center group">
                <FaCirclePlus className="text-gray-300 text-4xl group-hover:text-blue-200" />
                <Typography
                  variant="h6"
                  className="text-gray-300 mt-4 group-hover:text-blue-200"
                >
                  Tambah Rekam Medis
                </Typography>
              </Link>
            </div>
          )}
          {user?.role === "PASIEN" && kunjungan.rekamMedis !== null && (
            <Button variant="primary">Lihat Rekam Medis</Button>
          )}
        </section>
      ) : (
        <LoadingDiv />
      )}
    </main>
  );
};

export default withAuth(KunjunganPage, "user");
