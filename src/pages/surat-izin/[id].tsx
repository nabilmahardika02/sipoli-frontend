import Divider from "@/components/elements/Divider";
import Logo from "@/components/elements/Logo";
import Typography from "@/components/elements/Typography";
import {
  formatDateOnly,
  getJenisKelamin,
  getKewarganegaraan,
} from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { SuratIzin } from "@/types/entities/suratIzin";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const SuratIzinPage = () => {
  const router = useRouter();
  const [suratIzin, setSuratIzin] = useState<SuratIzin>();
  const [jumlahHari, setJumlahHari] = useState<number>();
  const [account, setAccount] = useState<Account>();

  const fetchJumlahHari = async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      "surat-izin/selisih-hari?tanggalAwal=" +
        suratIzin?.tanggalAwal +
        "&tanggalAkhir=" +
        suratIzin?.tanggalAkhir
    );

    if (isSuccess) {
      setJumlahHari(responseData as number);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady) return;
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "surat-izin/" + router.query.id
      );

      if (isSuccess && responseData) {
        setSuratIzin(responseData as SuratIzin);
      }
    };

    if (router.query.id) {
      fetchData();
    }
  }, [router.query.id]);

  useEffect(() => {
    if (suratIzin) {
      fetchJumlahHari();
    }
  }, [suratIzin]);

  const isExpired = () => {
    const today = new Date();
    const endDate = new Date(
      suratIzin?.tanggalAkhir ? formatDateOnly(suratIzin.tanggalAkhir) : "-"
    );

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return endDate < today;
  };

  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/profile/" + suratIzin?.kunjungan.profile.id
      );

      if (isSuccess && responseData) {
        setAccount(responseData as Account);
      }
    };

    fetchAccount();
  }, [router.query.id]);

  return (
    <main className="w-full h-full p-8 bg-gray-100 flex flex-col items-center gap-5">
      <section className="bg-white shadow-lg p-8 rounded-xl w-[90%] lg:w-[70%]">
        <Typography variant="h6" className="text-primary-1 text-left">
          Surat Keterangan Sakit
        </Typography>
        <Divider />
        <div className="flex flex-col gap-4">
          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex-1">
            <Typography weight="semibold" className="text-gray-400">
              Diberikan istirahat sakit selama{" "}
              <span className="text-primary-1 font-bold">
                {jumlahHari} hari
              </span>{" "}
              terhitung mulai tanggal{" "}
              <span className="text-primary-1 font-bold">
                {suratIzin?.tanggalAwal
                  ? formatDateOnly(suratIzin.tanggalAwal)
                  : "-"}
              </span>{" "}
              s.d tanggal{" "}
              <span className="text-primary-1 font-bold">
                {suratIzin?.tanggalAkhir
                  ? formatDateOnly(suratIzin.tanggalAkhir)
                  : "-"}
              </span>
            </Typography>
          </div>
          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex-1">
            <Typography weight="semibold" className="text-gray-400">
              Diagnosis Akhir:
            </Typography>
            <Typography weight="bold" className="text-primary-1">
              {
                suratIzin?.kunjungan.hasilPemeriksaan.diagnosaAkhir
                  .diagnosaKerja
              }
            </Typography>
          </div>

          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex-1">
            <Typography weight="semibold" className="text-gray-400">
              Diagnosa ICD10:
            </Typography>
            <Typography weight="bold" className="text-primary-1">
              {suratIzin?.kunjungan.hasilPemeriksaan.diagnosaAkhir.icd10}
            </Typography>
          </div>

          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex flex-col items-left gap-2">
            <Typography weight="semibold" className="text-gray-400">
              Masa aktif dokumen:
            </Typography>
            <div className="flex items-center gap-2">
              <Typography weight="bold">
                {isExpired() ? (
                  <span className="text-red-500">Kadaluarsa</span>
                ) : (
                  <span className="text-green-500">Aktif</span>
                )}
              </Typography>
              {isExpired() ? (
                <span className="text-red-500 text-2xl font-bold">
                  <RxCross2 />
                </span>
              ) : (
                <span className="text-green-500 text-2xl font-bold">
                  <FaCheck />
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Pasien */}
      <section className="bg-white shadow-lg p-8 rounded-xl w-[90%] lg:w-[70%]">
        <Typography variant="h6" className="text-primary-1 text-left">
          Informasi Pasien
        </Typography>
        <Divider />
        <div className="flex flex-col gap-4">
          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex-1">
            <Typography weight="semibold" className="text-gray-400">
              Nama:
            </Typography>
            <Typography weight="bold" className="text-primary-1">
              {suratIzin?.kunjungan.profile.name} (
              {suratIzin?.kunjungan.profile.jenisKelamin
                ? getJenisKelamin(suratIzin?.kunjungan.profile.jenisKelamin)
                : "-"}
              )
            </Typography>
          </div>

          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex-1">
            <Typography weight="semibold" className="text-gray-400">
              Alamat:
            </Typography>
            <Typography weight="bold" className="text-primary-1">
              {account?.alamat}
            </Typography>
          </div>

          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex flex-col items-left gap-2">
            <Typography weight="semibold" className="text-gray-400">
              Kewarganegaraan:
            </Typography>
            <Typography weight="bold" className="text-primary-1">
              {getKewarganegaraan(
                suratIzin?.kunjungan.profile.kewarganegaraan
                  ? suratIzin?.kunjungan.profile.kewarganegaraan
                  : true
              )}
            </Typography>
          </div>
        </div>
      </section>

      {/* Faskes Penerbit */}
      <section className="bg-white shadow-lg p-8 rounded-xl w-[90%] lg:w-[70%]">
        <Typography variant="h6" className="text-primary-1 text-left">
          Faskes Penerbit
        </Typography>
        <Divider />
        <div className="flex flex-col gap-4">
          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex items-center gap-2">
            <Logo />
            <Typography className="text-primary-1" weight="bold">
              Balai Diklat PKN Bali
            </Typography>
          </div>

          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex-1">
            <Typography weight="semibold" className="text-gray-400">
              Alamat:
            </Typography>
            <Typography weight="bold" className="text-primary-1">
              Jl. Permata Pering, Desa Pering, Kec. Blahbatuh, Kab. Gianyar,
              Bali
            </Typography>
          </div>

          <div className="bg-gray-60 shadow-md rounded-lg p-4 border flex flex-col items-left gap-2">
            <Typography weight="semibold" className="text-gray-400">
              Nomor Telepon:
            </Typography>
            <Typography weight="bold" className="text-primary-1">
              (0361) 4799993
            </Typography>
          </div>
        </div>
      </section>
      <div className="my-2 flex items-center gap-2">
        <Typography className="text-primary-1">Powered by SIPOLI</Typography>
        <Logo/>
      </div>
    </main>
  );
};

export default SuratIzinPage;
