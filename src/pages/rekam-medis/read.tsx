import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import sendRequest from "@/lib/getApi";
import { RekamMedis } from "@/types/entities/rekamMedis"; // Pastikan path ini sesuai dengan file Anda

const RekamMedisReadPage = () => {
  const router = useRouter();
  const { rekamMedisId } = router.query; // Ambil rekamMedisId dari query parameter
  const [rekamMedis, setRekamMedis] = useState<RekamMedis | null>(null);
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  // Fetch rekam medis detail berdasarkan rekamMedisId
  useEffect(() => {
    if (rekamMedisId) {
      const fetchRekamMedis = async () => {
        setLoading(true); // Mulai loading saat request dimulai
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          `rekam-medis/read?rekamMedisId=${rekamMedisId}`
        );
        if (isSuccess) {
          setRekamMedis(responseData.result); // Set state dengan data rekam medis
        } else {
          console.error("Error fetching rekam medis:", message);
        }
        setLoading(false); // Selesai loading setelah request selesai
      };

      fetchRekamMedis();
    }
  }, [rekamMedisId]);

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading jika data belum ada
  }

  if (!rekamMedis) {
    return <div>Rekam medis tidak ditemukan</div>; // Menampilkan pesan jika rekam medis tidak ditemukan
  }

  return (
    <main>
      <section className="mt-5">
        <Typography variant="h4" weight="bold" className="text-primary-1 mb-5">
          Detail Rekam Medis Pasien
        </Typography>

        {/* Informasi Pasien */}
        <div className="grid grid-cols-2 gap-5">
          <Typography variant="p1">
            <strong>Nama Pasien:</strong> {rekamMedis.namaPasien || "Data tidak tersedia"}
          </Typography>
          <Typography variant="p1">
            <strong>Tanggal Kunjungan:</strong> {rekamMedis.tanggalKunjungan || "Data tidak tersedia"}
          </Typography>
          <Typography variant="p1">
            <strong>Tinggi Badan:</strong> {rekamMedis.tinggiBadan || "Data tidak tersedia"} cm
          </Typography>
          <Typography variant="p1">
            <strong>Berat Badan:</strong> {rekamMedis.beratBadan || "Data tidak tersedia"} kg
          </Typography>
          <Typography variant="p1">
            <strong>Tensi Darah:</strong> {rekamMedis.tensiDarah || "Data tidak tersedia"}
          </Typography>
        </div>

        {/* Keluhan */}
        <Typography variant="h5" weight="bold" className="mt-8">
          Keluhan
        </Typography>
        <Typography variant="p1">{rekamMedis.keluhan || "Data tidak tersedia"}</Typography>

        {/* Diagnosis */}
        <Typography variant="h5" weight="bold" className="mt-8">
          Diagnosis
        </Typography>
        <Typography variant="p1">{rekamMedis.diagnosis || "Data tidak tersedia"}</Typography>

        {/* Obat */}
        <Typography variant="h5" weight="bold" className="mt-8">
          Obat yang Diresepkan
        </Typography>
        {rekamMedis.obatList && rekamMedis.obatList.length > 0 ? (
          <table className="min-w-full table-auto mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama Obat</th>
                <th className="px-4 py-2">Kuantitas</th>
              </tr>
            </thead>
            <tbody>
              {rekamMedis.obatList.map((obat, index) => (
                <tr key={obat.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{obat.nama}</td>
                  <td className="border px-4 py-2">{obat.kuantitas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography variant="p1">Tidak ada obat yang diresepkan.</Typography>
        )}

        {/* Resep Obat */}
        {rekamMedis.resepObat && rekamMedis.resepObat.deskripsi && (
          <>
            <Typography variant="h5" weight="bold" className="mt-8">
              Resep Obat
            </Typography>
            <Typography variant="p1">{rekamMedis.resepObat.deskripsi}</Typography>
          </>
        )}

        {/* Rujukan */}
        {rekamMedis.rujukan && rekamMedis.rujukan.tujuan && (
          <>
            <Typography variant="h5" weight="bold" className="mt-8">
              Rujukan
            </Typography>
            <Typography variant="p1">
              <strong>Tujuan:</strong> {rekamMedis.rujukan.tujuan}
            </Typography>
            <Typography variant="p1">
              <strong>Dokter:</strong> {rekamMedis.rujukan.dokter}
            </Typography>
            <Typography variant="p1">
              <strong>Maksimal Berlaku:</strong> {new Date(rekamMedis.rujukan.maksimalBerlaku).toLocaleDateString('id-ID')}
            </Typography>
          </>
        )}
      </section>
    </main>
  );
};

export default withAuth(RekamMedisReadPage, "user");
