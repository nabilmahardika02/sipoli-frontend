import Divider from "@/components/elements/Divider";
import Typography from "@/components/elements/Typography";
import { formatDateOnly } from "@/lib/formater";
import { getSatuanObat } from "@/lib/formater";
import { KuantitasObat } from "@/types/entities/kuantitasObat";
import { ResepObatRujukan } from "@/types/entities/kunjungan";
import { HasilPemeriksaan } from "@/types/entities/kunjungan";

const DataResepObat = ({
  listKuantitasObat,
  resepObatRujukan,
  data,
}: {
  listKuantitasObat: KuantitasObat[];
  resepObatRujukan?: ResepObatRujukan;
  data: HasilPemeriksaan;
}) => {
  return (
    <div>
      <Divider weight="thin" className="my-5" />
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Resep Obat
        </Typography>
      </div>

      {listKuantitasObat.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {listKuantitasObat.map((kuantitasObat, index) => {
            const closestExpiryDate =
              kuantitasObat.obat.listRestockObat?.length > 0
                ? kuantitasObat.obat.listRestockObat
                    .map((restock) => restock.tanggalKadaluarsa)
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
                : null;

            const jenisSatuan = getSatuanObat(kuantitasObat.obat.jenisSatuan);

            return (
              <div key={index} className="border p-3 rounded-lg mb-2">
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Obat
                </Typography>
                <Typography className="text-primary-1">
                  {kuantitasObat.obat.namaObat || "-"}
                </Typography>

                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400 mt-2"
                >
                  Kuantitas
                </Typography>
                <Typography className="text-primary-1">
                  {kuantitasObat.kuantitas} {jenisSatuan}
                </Typography>

                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400 mt-2"
                >
                  Tanggal Kadaluarsa
                </Typography>
                <Typography className="text-primary-1">
                  {closestExpiryDate
                    ? formatDateOnly(closestExpiryDate)
                    : "Tidak tersedia"}
                </Typography>

                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400 mt-2"
                >
                  Petunjuk Pemakaian
                </Typography>
                <Typography className="text-primary-1">
                  {kuantitasObat.petunjukPemakaian || "-"}
                </Typography>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Pasien tidak diberikan obat dari klinik
          </Typography>
        </div>
      )}

      {/* Resep Obat Rujukan */}
      {resepObatRujukan?.deskripsi && (
        <div className="mt-3">
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Resep Obat di Luar Klinik
          </Typography>
          <Typography className="text-primary-1">
            {resepObatRujukan.deskripsi}
          </Typography>
        </div>
      )}
        {/* Bagian KIE */}
        {data?.kie && (
        <div className="mt-5">
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Komunikasi Informasi dan Edukasi
          </Typography>
          <Typography className="text-primary-1">{data.kie}</Typography>
        </div>
      )}
    </div>
  );
};

export default DataResepObat;
