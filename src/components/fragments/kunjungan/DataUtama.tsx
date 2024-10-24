import Typography from "@/components/elements/Typography";
import { HasilPemeriksaan } from "@/types/entities/kunjungan";

const DataUtama = ({ data }: { data: HasilPemeriksaan }) => {
  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Data Pemeriksaan Utama
        </Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Keluhan Utama
          </Typography>
          <Typography className="text-primary-1">
            {data.keluhanUtama || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Riwayat Penyakit Sekarang
          </Typography>
          <Typography className="text-primary-1">
            {data.riwayatPenyakitSekarang || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Komunikasi Informasi dan Edukasi
          </Typography>
          <Typography className="text-primary-1">{data.kie || "-"}</Typography>
        </div>
      </div>
    </div>
  );
};

export default DataUtama;
