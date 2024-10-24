import Typography from "@/components/elements/Typography";
import { Rujukan } from "@/types/entities/kunjungan";

const DataRujukan = ({ data }: { data: Rujukan }) => {
  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Rujukan
        </Typography>
      </div>
      {data.dokter || data.catatan || data.maksimalBerlaku || data.tujuan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Dokter Tujuan
            </Typography>
            <Typography className="text-primary-1">
              {data.dokter || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Tujuan Rujukan
            </Typography>
            <Typography className="text-primary-1">
              {data.tujuan || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Catatan
            </Typography>
            <Typography className="text-primary-1">
              {data.catatan || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Maksimal Berlaku
            </Typography>
            <Typography className="text-primary-1">
              {data.maksimalBerlaku || "-"}
            </Typography>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Pasien tidak membutuhkan rujukan
          </Typography>
        </div>
      )}
    </div>
  );
};

export default DataRujukan;
