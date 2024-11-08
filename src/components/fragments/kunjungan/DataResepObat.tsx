import Typography from "@/components/elements/Typography";
import { KuantitasObat } from "@/types/entities/kunjungan";

const DataResepObat = ({
  listKuantitasObat,
  resepObatRujukan
}: {
  listKuantitasObat: KuantitasObat[];
  resepObatRujukan: string;
}) => {
  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Resep Obat
        </Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {listKuantitasObat.length > 0 ? (
          listKuantitasObat.map((obat, index) => (
            <div key={index} className="border p-3 rounded-lg mb-2">
              <Typography variant="p2" weight="semibold" className="text-gray-400">
                Obat
              </Typography>
              <Typography className="text-primary-1">
                {obat.obatId || "-"}
              </Typography>
              
              <Typography variant="p2" weight="semibold" className="text-gray-400 mt-2">
                Kuantitas
              </Typography>
              <Typography className="text-primary-1">{obat.kuantitas}</Typography>
              
              <Typography variant="p2" weight="semibold" className="text-gray-400 mt-2">
                Petunjuk Pemakaian
              </Typography>
              <Typography className="text-primary-1">{obat.petunjukPemakaian || "-"}</Typography>
            </div>
          ))
        ) : (
          <Typography className="text-gray-400">Tidak ada obat yang dipilih</Typography>
        )}
        {resepObatRujukan && (
          <div className="border p-3 rounded-lg">
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Resep Obat di Luar Klinik
            </Typography>
            <Typography className="text-primary-1">{resepObatRujukan}</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataResepObat;
