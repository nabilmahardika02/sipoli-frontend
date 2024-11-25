import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Typography from "../elements/Typography";
import Logo from "../elements/Logo";
import Divider from "../elements/Divider";
import Button from "../elements/Button";
import { formatDate, formatDateWithoutDays } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { Kunjungan } from "@/types/entities/kunjungan";
import QRCodeGenerator from "./QRCodeGenerator";
import { SuratIzin } from "@/types/entities/suratIzin";

interface SuratIzinPDFProps {
  tanggalAwal: string | Date | undefined; // Sesuaikan jika tanggal dalam format string atau Date
  tanggalAkhir: string | Date | undefined;
  kunjungan: Kunjungan | undefined;
}

const SuratIzinPDF: React.FC<SuratIzinPDFProps> = ({
  tanggalAwal,
  tanggalAkhir,
  kunjungan,
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [jumlahHari, setJumlahHari] = useState<number>();
  const [account, setAccount] = useState<Account>();
  const [nomorSurat, setNomorSurat] = useState<string>();
  const [createdAt, setCreatedAt] = useState<string | Date>();
  const [suratIzin, setSuratIzin] = useState<SuratIzin | null>(null);

  useEffect(() => {
    const fetchJumlahHari = async () => {
      if (tanggalAwal && tanggalAkhir) {
        // Pastikan kedua tanggal sudah terisi
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          `surat-izin/selisih-hari?tanggalAwal=${tanggalAwal}&tanggalAkhir=${tanggalAkhir}`
        );
        if (isSuccess) {
          setJumlahHari(responseData as number);
        }
      }
    };

    fetchJumlahHari(); // Panggil sekali, bukan di dalam fungsi itu sendiri
  }, [tanggalAwal, tanggalAkhir]);

  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/profile/" + kunjungan?.profile.id
      );

      if (isSuccess && responseData) {
        setAccount(responseData as Account);
      }
    };

    fetchAccount();
  }, [kunjungan]);

  useEffect(() => {
    setCreatedAt(new Date());

    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "surat-izin/jumlah-surat"
      );

      if (isSuccess && responseData !== undefined) {
        const jumlahSurat = responseData as number;

        // Format nomor surat
        const nomorSuratPadded = (jumlahSurat + 1).toString().padStart(6, "0");

        // Dapatkan bulan dan tahun saat ini
        const currentDate = new Date();
        const bulanRomawi = [
          "I",
          "II",
          "III",
          "IV",
          "V",
          "VI",
          "VII",
          "VIII",
          "IX",
          "X",
          "XI",
          "XII",
        ][currentDate.getMonth()]; // 0 untuk Januari, 11 untuk Desember
        const tahun = currentDate.getFullYear();

        // Gabungkan menjadi nomor surat
        const nomorSuratBaru = `BPK/PO.04/SK/${nomorSuratPadded}/${bulanRomawi}/${tahun}`;
        setNomorSurat(nomorSuratBaru);
      }
    };

    fetchData();
  }, []);

  const handleGeneratePDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save("Surat-Keterangan-Sakit.pdf");
  };

  const postData = async () => {
    const payload = {
      tanggalAwal: tanggalAwal,
      tanggalAkhir: tanggalAkhir,
      kunjunganId: kunjungan?.id,
      nomorSurat: nomorSurat,
      createdAt: createdAt,
    };
    const [responseData, message, isSuccess] = await sendRequest(
      "post",
      `surat-izin/add`,
      payload,
      true
    );

    if (isSuccess) {
      handleGeneratePDF();
    }
  };

  const fetchSuratIzin = async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      `surat-izin/kunjungan/${kunjungan?.id}`
    );

    if (isSuccess && responseData) {
      setSuratIzin(responseData as SuratIzin);
    } else {
      setSuratIzin(null);
    }
  };

  useEffect(() => {
    fetchSuratIzin();
  }, [kunjungan]);

  return (
    <div className="p-6">
      {/* Template PDF */}
      <div
        ref={pdfRef}
        className="border p-4 bg-white rounded shadow-md max-w-lg mx-auto"
        style={{ fontFamily: "Arial, sans-serif", fontSize: "12px" }}
      >
        <section className="bg-white w-full h-full">
          <div className="flex justify-between items-center gap-2">
            <div className="h-full items-center">
              <Logo sizeCustom={60} />
            </div>
            <div>
              <Typography weight="bold">Balai Diklat PKN Bali</Typography>
              <Typography variant="p4">
                Jl. Permata Pering, Desa Pering, Kec. Blahbatuh,
              </Typography>
              <Typography variant="p4">
                Kab. Gianyar, Bali / (0361) 4799993
              </Typography>
            </div>
            <div className="text-right">
              <Typography variant="p4" weight="bold">
                SURAT KETERANGAN SAKIT
              </Typography>
              {suratIzin === null && (
                <Typography variant="p4">
                  {nomorSurat ? nomorSurat : "-"}
                </Typography>
              )}
              {suratIzin !== null && (
                <Typography variant="p4">
                  {suratIzin.nomorSurat ? suratIzin.nomorSurat : "-"}
                </Typography>
              )}
            </div>
          </div>
          <Divider weight="kurus" />
          <div className="flex flex-col gap-2">
            <Typography variant="p4" className="text-justify indent-8">
              Dengan ini menerangkan bahwa hasil pemeriksaan yang telah
              dilakukan kepada pasien
            </Typography>
            <div className="grid grid-cols-[100px_10px_1fr] gap-y-1">
              <Typography variant="p4">Nama</Typography>
              <Typography variant="p4">:</Typography>
              <Typography variant="p4">{kunjungan?.profile.name}</Typography>

              <Typography variant="p4">Nomor Identitas</Typography>
              <Typography variant="p4">:</Typography>
              <Typography variant="p4">{kunjungan?.profile.nik}</Typography>

              <Typography variant="p4">Alamat lengkap</Typography>
              <Typography variant="p4">:</Typography>
              <Typography variant="p4">{account?.alamat}</Typography>
            </div>
            <Typography variant="p4" className="text-justify indent-8">
              Diberikan istirahat sakit selama {jumlahHari ? jumlahHari : "-"}{" "}
              hari terhitung mulai tanggal{" "}
              {tanggalAwal ? formatDateWithoutDays(tanggalAwal) : "-"} s.d
              tanggal {tanggalAkhir ? formatDateWithoutDays(tanggalAkhir) : "-"}
            </Typography>
            <Typography variant="p4" className="text-justify indent-8">
              Demikian surat keterangan ini diberikan untuk diketahui dan
              digunakan seperlunya
            </Typography>
          </div>
          <div className="grid grid-cols-2 place-items-center min-h-[100px] my-2">
            <div className="flex flex-col items-center">
              <QRCodeGenerator
                link={`https://sipoli-bpk.vercel.app/kunjungan/surat-izin/${kunjungan?.id}`}
                size={100}
              />
              <Typography variant="p4" className="text-center">
                Dokumen ini dibuat otomatis oleh komputer, scan QR code untuk
                informasi lebih lanjut
              </Typography>
            </div>
            <div className="flex flex-col items-center">
              {suratIzin === null && (
                <Typography variant="p4" className="text-center">
                  KAB. GIANYAR, {formatDateWithoutDays(new Date())}
                </Typography>
              )}
              {suratIzin !== null && (
                <Typography variant="p4" className="text-center">
                  KAB. GIANYAR, {formatDateWithoutDays(suratIzin.createdAt)}
                </Typography>
              )}
              <Typography>
                <br></br>
                <br></br>
                <br></br>
              </Typography>
              <Typography variant="p4" className="text-center">
                {kunjungan?.dokter.name}
              </Typography>
            </div>
          </div>
          <Divider weight="kurus" />
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Typography variant="p4">Powered by SIPOLI</Typography>
              <Logo sizeCustom={20} />
            </div>
            {suratIzin === null && (
              <Typography variant="p4">
                Diterbitkan pada {createdAt ? formatDate(createdAt) : "-"}
              </Typography>
            )}
            {suratIzin !== null && (
              <Typography variant="p4">
                Diterbitkan pada{" "}
                {suratIzin.createdAt ? formatDate(suratIzin.createdAt) : "-"}
              </Typography>
            )}
          </div>
        </section>
      </div>

      <div className="mt-4 flex justify-end">
        {suratIzin === null && (
          <Button onClick={postData} variant="primary">
            Unduh Dokumen
          </Button>
        )}
        {suratIzin !== null && (
          <Button onClick={handleGeneratePDF} variant="primary">
            Unduh Dokumen
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuratIzinPDF;
