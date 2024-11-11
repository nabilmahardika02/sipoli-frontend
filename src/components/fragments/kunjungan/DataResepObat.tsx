import Typography from "@/components/elements/Typography";
import { KuantitasObat } from "@/types/entities/kuantitasObat"; // Gunakan tipe yang sama dari kuantitasObat
import { ResepObatRujukan } from "@/types/entities/kunjungan";

const DataResepObat = ({ listKuantitasObat, resepObatRujukan }: { listKuantitasObat: KuantitasObat[], resepObatRujukan?: ResepObatRujukan }) => {
  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Resep Obat
        </Typography>
      </div>

      {listKuantitasObat.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {listKuantitasObat.map((kuantitasObat, index) => (
            <div key={index} className="border p-3 rounded-lg mb-2">
              <Typography variant="p2" weight="semibold" className="text-gray-400">
                Obat
              </Typography>
              <Typography className="text-primary-1">
                {kuantitasObat.obat.namaObat || "-"}
              </Typography>

              <Typography variant="p2" weight="semibold" className="text-gray-400 mt-2">
                Kuantitas
              </Typography>
              <Typography className="text-primary-1">{kuantitasObat.kuantitas}</Typography>

              <Typography variant="p2" weight="semibold" className="text-gray-400 mt-2">
                Petunjuk Pemakaian
              </Typography>
              <Typography className="text-primary-1">
                {kuantitasObat.petunjukPemakaian || "-"}
              </Typography>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Pasien tidak diberikan obat dari klinik
          </Typography>
        </div>
      )}

      {resepObatRujukan?.deskripsi && (
        <div className="border p-3 rounded-lg mt-3">
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Resep Obat di Luar Klinik
          </Typography>
          <Typography className="text-primary-1">{resepObatRujukan.deskripsi}</Typography>
        </div>
      )}
    </div>
  );
};

export default DataResepObat;
