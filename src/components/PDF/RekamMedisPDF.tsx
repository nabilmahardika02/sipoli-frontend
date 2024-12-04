import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  calculateOnlyYearAge,
  formatDate,
  getCurrentDateTime,
  getJenisKelamin,
  getKewarganegaraan,
  getSatuanObat,
} from "@/lib/formater";
import jsPDF, { RGBAData } from "jspdf";
import html2canvas from "html2canvas";
import Typography from "../elements/Typography";
import Logo from "../elements/Logo";
import Divider from "../elements/Divider";
import Button from "../elements/Button";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { Pasien } from "@/types/entities/profile";
import { Kunjungan } from "@/types/entities/kunjungan";

interface RekamMedisPDFProps {
  kunjungan: Kunjungan | undefined;
}

const RekamMedisPDF: React.FC<RekamMedisPDFProps> = ({ kunjungan }) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [account, setAccount] = useState<Account>();
  const [pasien, setPasien] = useState<Pasien>();
  const [createdAt, setCreatedAt] = useState<string>();

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

  const fetchProfile = useCallback(async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      `/profile/detail/${kunjungan?.profile.id}`
    );

    if (isSuccess) {
      setPasien(responseData as Pasien);
    }
  }, [kunjungan?.profile.id]);

  useEffect(() => {
    if (kunjungan) {
      fetchProfile();
    }
  }, [fetchProfile, kunjungan]);

  useEffect(() => {
    setCreatedAt(getCurrentDateTime());
  }, []);

  const handleGeneratePDF = async () => {
    if (!pdfRef.current) return;

    try {
      // Increase timeout and add error handling
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2, // Reduced scale to improve performance
        useCORS: true,
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY,
      });

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Function to add pages
      const addPages = (
        imgData:
          | string
          | HTMLCanvasElement
          | HTMLImageElement
          | Uint8Array
          | RGBAData
      ) => {
        let remainingHeight = imgHeight;
        let currentPosition = 0;

        while (remainingHeight > 0) {
          if (currentPosition > 0) {
            pdf.addPage();
          }

          // Calculate height for current page
          const pageImgHeight = Math.min(remainingHeight, pdfHeight);

          pdf.addImage(
            imgData,
            "PNG",
            0,
            -currentPosition,
            pdfWidth,
            imgHeight
          );

          currentPosition += pdfHeight;
          remainingHeight -= pdfHeight;
        }
      };

      const imgData = canvas.toDataURL("image/png");
      addPages(imgData);

      pdf.save(`Rekam-Medis-${pasien?.noRekamMedis}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Template PDF */}
      <div className="mt-4 flex justify-end">
        <Button onClick={handleGeneratePDF} variant="primary">
          Unduh Dokumen
        </Button>
      </div>
      <br></br>
      <div
        ref={pdfRef}
        className="border p-4 bg-white rounded shadow-md max-w-lg mx-auto"
        style={{ fontFamily: "Arial, sans-serif", fontSize: "12px" }}
      >
        <section className="bg-white w-full h-full">
          <div>
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
                <div className="flex flex-col">
                  <Typography variant="p4" weight="bold">
                    REKAM MEDIS
                  </Typography>
                  <Typography variant="p4" weight="bold">
                    {pasien?.noRekamMedis}
                  </Typography>
                </div>
              </div>
            </div>
            <Divider weight="kurus" />
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Informasi Utama
            </Typography>

            <div className="grid grid-cols-[100px_150px_1fr] gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Nama Pasien
                </Typography>
                <Typography variant="p4">{kunjungan?.profile.name}</Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Kewarganegaraan
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.profile.kewarganegaraan
                    ? getKewarganegaraan(kunjungan?.profile.kewarganegaraan)
                    : "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Alamat
                </Typography>
                <Typography variant="p4">{account?.alamat}</Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Jenis Kelamin
                </Typography>
                <Typography variant="p4">
                  {kunjungan
                    ? getJenisKelamin(kunjungan?.profile.jenisKelamin)
                    : "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Tanggal Lahir/Umur
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.profile.tanggalLahir}/
                  {calculateOnlyYearAge(kunjungan?.profile.tanggalLahir || "-")}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Nomor Rekam Medis
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.profile.noRekamMedis || "-"}
                </Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Informasi Pemeriksaan
            </Typography>

            <div className="grid grid-cols-[160px_1fr] gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Dokter
                </Typography>
                <Typography variant="p4">{kunjungan?.dokter.name}</Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Tanggal Masuk
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.tanggalPeriksa
                    ? formatDate(kunjungan?.tanggalPeriksa)
                    : "-"}
                </Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Anamnesa (Keluhan dan Gejala Penyakit)
            </Typography>
            <div className="grid grid-cols-[100px_1fr] gap-y-1">
              <Typography variant="p4" className="font-light">
                Keluhan Utama
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.keluhanUtama || "-"}
              </Typography>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-y-1">
              <Typography variant="p4" className="font-light">
                Riwayat Penyakit Sekarang
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.riwayatPenyakitSekarang || "-"}
              </Typography>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Riwayat Penyakit Dahulu
            </Typography>

            <div className="grid grid-cols-3 justify-between gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Kelainan Jantung
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.kelainanJantung || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Penyakit Hati
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.penyakitHati || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Kelainan Saluran Cerna
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.kelainanSaluranCerna
                    ? formatDate(
                        pasien?.riwayatPenyakitDahulu.kelainanSaluranCerna ||
                          "-"
                      )
                    : "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Kencing Manis
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.kencingManis
                    ? formatDate(
                        pasien?.riwayatPenyakitDahulu.kencingManis || "-"
                      )
                    : "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Rawat Inap
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.rawatInap
                    ? formatDate(pasien?.riwayatPenyakitDahulu.rawatInap || "-")
                    : "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Kecelakaan
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.kecelakaan
                    ? formatDate(
                        pasien?.riwayatPenyakitDahulu.kecelakaan || "-"
                      )
                    : "-"}
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-[160px_1fr] gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Tindakan Bedah
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.tindakanBedah
                    ? formatDate(
                        pasien?.riwayatPenyakitDahulu.tindakanBedah || "-"
                      )
                    : "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Obat-obatan dan Penyakit Lainnya
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitDahulu.lainnya
                    ? formatDate(pasien?.riwayatPenyakitDahulu.lainnya || "-")
                    : "-"}
                    
                </Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Riwayat Penyakit Keluarga
            </Typography>

            <div className="grid grid-cols-3 justify-between gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Kencing Manis
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitKeluarga.kencingManis || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Darah Tinggi
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitKeluarga.darahTinggi || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Penyakit Jantung
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitKeluarga.penyakitJantung || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Tumor
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitKeluarga.tumor || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Ginjal
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitKeluarga.ginjal || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Gangguan Jiwa
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitKeluarga.gangguanJiwa || "-"}
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-[1fr] gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Riwayat Penyakit Keluarga Lainnya
                </Typography>
                <Typography variant="p4">
                  {pasien?.riwayatPenyakitKeluarga.lainnya || "-"}
                </Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Kebiasaan
            </Typography>

            <div className="grid grid-cols-3 justify-between gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Merokok
                </Typography>
                <Typography variant="p4">
                  {pasien?.kebiasaan.merokok || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Alkohol
                </Typography>
                <Typography variant="p4">
                  {pasien?.kebiasaan.alkohol || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Olahraga
                </Typography>
                <Typography variant="p4">
                  {pasien?.kebiasaan.olahraga || "-"}
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-[1fr] gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Obat-obatan
                </Typography>
                <Typography variant="p4">
                  {pasien?.kebiasaan.obatObatan || "-"}
                </Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Pemeriksaan Fisik
            </Typography>

            <div className="grid grid-cols-4 gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Temperature
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.suhu || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Blood Pressure
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.tensi || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Mean Arterial Pressure
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.meanArteri ||
                    "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Respiratory Rate
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik
                    .respiratoryRate || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Heart Rate
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.heartRate ||
                    "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Oxygen Saturation
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik
                    .oxygenSaturation || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Kesadaran
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.kesadaran ||
                    "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Eye
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.eye || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Verbal
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.verbal || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Motorik
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.pemeriksaanFisik.motorik || "-"}
                </Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Status Present
            </Typography>

            <div className="grid grid-cols-[50px_10px_1fr] gap-y-1">
              <Typography variant="p4" className="font-light">
                Mata
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.mata || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Telinga
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.telinga || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Hidung
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.hidung || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Tonsil
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.tonsil || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Faring
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.faring || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Cor
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.cor || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Pulmo
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.pulmo || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Abd
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.abd || "-"}
              </Typography>

              <Typography variant="p4" className="font-light">
                Ext
              </Typography>
              <Typography variant="p4" className="font-light">
                :
              </Typography>
              <Typography variant="p4">
                {kunjungan?.hasilPemeriksaan.statusPresent.ext || "-"}
              </Typography>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Diagnosa Akhir
            </Typography>

            <div className="grid grid-cols-2 justify-between gap-y-1">
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  ICD10
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.diagnosaAkhir.icd10 || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Diagnosa Kerja
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.diagnosaAkhir.diagnosaKerja ||
                    "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  Rencana
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.diagnosaAkhir.rencana || "-"}
                </Typography>
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="p4" className="font-light">
                  TIndakan Medis/Operasi
                </Typography>
                <Typography variant="p4">
                  {kunjungan?.hasilPemeriksaan.diagnosaAkhir.tindakan || "-"}
                </Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Pengobatan yang Diberikan
            </Typography>
            <div className="grid grid-cols-[1fr] gap-y-1">
              {kunjungan?.hasilPemeriksaan.listKuantitasObat.map(
                (kuantitasObat, index) => (
                  <div key={index}>
                    <Typography variant="p4">
                      {index +
                        1 +
                        ". " +
                        kuantitasObat.obat.namaObat +
                        " (" +
                        kuantitasObat.kuantitas +
                        " " +
                        getSatuanObat(kuantitasObat.obat.jenisSatuan) +
                        ") " +
                        kuantitasObat.petunjukPemakaian || "-"}
                    </Typography>
                  </div>
                )
              )}
            </div>
          </div>
          <br></br>
          <div className="flex flex-col gap-2">
            <Typography variant="p3" className="font-semibold">
              Komunikasi Informasi dan Edukasi
            </Typography>

            <div className="grid grid-cols-[1fr] gap-y-1">
              <Typography variant="p4" className="font-light">
                {kunjungan?.hasilPemeriksaan.kie || "-"}
              </Typography>
            </div>
          </div>
          <br></br>
          <div className="grid grid-cols-2 place-items-center min-h-[100px] my-2">
            <div className="flex flex-col items-center">
              <Typography variant="p4" className="text-center">
                Dokter Yang Merawat
              </Typography>
              <Typography>
                <br></br>
                <br></br>
                <br></br>
              </Typography>
              <Typography variant="p4" className="text-center">
                dr. {kunjungan?.dokter.name}
              </Typography>
            </div>
            <div className="flex flex-col items-center">
              <Typography variant="p4" className="text-center">
                Keluarga/Pasien
              </Typography>
              <Typography>
                <br></br>
                <br></br>
                <br></br>
              </Typography>
              <Typography variant="p4" className="text-center">
                {kunjungan?.profile.name}
              </Typography>
            </div>
          </div>
          <div>
            <Divider weight="kurus" />
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Typography variant="p4">Powered by SIPOLI</Typography>
                <Logo sizeCustom={20} />
              </div>
              <Typography variant="p4">
                Diterbitkan pada {createdAt ? formatDate(createdAt) : "-"}
              </Typography>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RekamMedisPDF;
