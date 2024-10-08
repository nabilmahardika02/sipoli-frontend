import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RekamMedis } from "@/types/entities/rekamMedis";
import Link from "next/link";

const RekamMedisDetailPage = () => {
  const { setTitle } = useDocumentTitle();
  const [rekamMedis, setRekamMedis] = useState<RekamMedis | null>(null);
  const router = useRouter();
  const { rekamMedisId } = router.query; // rekamMedisId diambil dari query params

  useEffect(() => {
    setTitle("Detail Rekam Medis");
  }, [setTitle]);

  useEffect(() => {
    if (router.isReady && rekamMedisId) {
      const fetchRekamMedis = async () => {
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          `/api/rekam-medis/read/${rekamMedisId}`
        );
        if (isSuccess) {
          setRekamMedis(responseData as RekamMedis);
        }
      };
      fetchRekamMedis();
    }
  }, [router.isReady, rekamMedisId]);

  if (!rekamMedis) {
    return <Typography>data rekam medis masih belum terambil...</Typography>;
  }

  return (
    <main>
      <section>
        <Typography variant="h4" weight="bold" className="text-primary-1 mb-5">
          Detail Rekam Medis
        </Typography>

        {/* Informasi Pasien */}
        <Typography variant="h6" weight="bold" className="mt-8">
          Informasi Pasien
        </Typography>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Typography variant="body1">
              Nama Pasien: {rekamMedis.namaPasien}
            </Typography>
          </div>
          <div className="text-right">
            <Typography variant="body1">
              Tanggal Kunjungan: {new Date(rekamMedis.tanggalKunjungan).toLocaleDateString('id-ID')}
            </Typography>
          </div>
        </div>

        {/* Informasi Rekam Medis */}
        <Typography variant="h6" weight="bold" className="mt-8">
          Informasi Rekam Medis
        </Typography>
        <div className="grid grid-cols-2 gap-5">
          <Typography variant="body1">Tinggi Badan: {rekamMedis.tinggiBadan} cm</Typography>
          <Typography variant="body1">Berat Badan: {rekamMedis.beratBadan} kg</Typography>
          <Typography variant="body1">Tensi Darah: {rekamMedis.tensi}</Typography>
          <Typography variant="body1">Diagnosis: {rekamMedis.diagnosis}</Typography>
        </div>

        {/* Obat */}
        <Typography variant="h6" weight="bold" className="mt-8">
          Obat yang Diberikan
        </Typography>
        {rekamMedis.listKuantitasObat.length > 0 ? (
          <table className="table-auto w-full mt-5 border-collapse border border-gray-300">
            <thead>
              <tr className="text-center bg-primary-1 text-white">
                <th className="border border-gray-300 p-2">No</th>
                <th className="border border-gray-300 p-2">Nama Obat</th>
                <th className="border border-gray-300 p-2">Kuantitas</th>
              </tr>
            </thead>
            <tbody>
              {rekamMedis.listKuantitasObat.map((obat, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{obat.namaObat}</td>
                  <td className="border border-gray-300 p-2">{obat.kuantitas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography>Tidak ada obat yang diberikan.</Typography>
        )}

        {/* Resep Obat */}
        {rekamMedis.resepObat && (
          <>
            <Typography variant="h6" weight="bold" className="mt-8">
              Resep Obat
            </Typography>
            <Typography variant="body1">{rekamMedis.resepObat.deskripsi}</Typography>
          </>
        )}

        {/* Rujukan */}
        {rekamMedis.rujukan && (
          <>
            <Typography variant="h6" weight="bold" className="mt-8">
              Rujukan
            </Typography>
            <Typography variant="body1">Tujuan: {rekamMedis.rujukan.tujuan}</Typography>
            <Typography variant="body1">Dokter: {rekamMedis.rujukan.dokter}</Typography>
            <Typography variant="body1">Catatan: {rekamMedis.rujukan.catatan}</Typography>
            <Typography variant="body1">
              Berlaku Hingga: {new Date(rekamMedis.rujukan.maksimalBerlaku).toLocaleDateString('id-ID')}
            </Typography>
          </>
        )}

        {/* Tombol Kembali */}
        <div className="mt-5 flex items-center gap-4">
          <Link href="/home">
            <Button variant="danger">Kembali</Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default withAuth(RekamMedisDetailPage, "user");
