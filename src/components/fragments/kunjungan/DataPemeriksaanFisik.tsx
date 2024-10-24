import Typography from "@/components/elements/Typography";
import { PemeriksaanFisik } from "@/types/entities/kunjungan";

const DataPemeriksaanFisik = ({ data }: { data: PemeriksaanFisik }) => {
  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Pemeriksaan Fisik
        </Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Tensi
          </Typography>
          <Typography className="text-primary-1">
            {data.tensi || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Eye
          </Typography>
          <Typography className="text-primary-1">{data.eye || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Mean Arteri
          </Typography>
          <Typography className="text-primary-1">
            {data.meanArteri || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Respiratory Rate
          </Typography>
          <Typography className="text-primary-1">
            {data.respiratoryRate || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Heart Rate
          </Typography>
          <Typography className="text-primary-1">
            {data.heartRate || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Oxygen Saturation
          </Typography>
          <Typography className="text-primary-1">
            {data.oxygenSaturation || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Kesadaran
          </Typography>
          <Typography className="text-primary-1">
            {data.kesadaran || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Verbal
          </Typography>
          <Typography className="text-primary-1">
            {data.verbal || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Motorik
          </Typography>
          <Typography className="text-primary-1">
            {data.motorik || "-"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DataPemeriksaanFisik;
