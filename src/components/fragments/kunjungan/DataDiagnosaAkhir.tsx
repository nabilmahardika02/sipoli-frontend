import Typography from "@/components/elements/Typography";
import { DiagnosaAkhir } from "@/types/entities/kunjungan";

const DataDiagnosaAkhir = ({ data }: { data: DiagnosaAkhir }) => {
  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Diagnosa Kerja
        </Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Diagnosa Kerja
          </Typography>
          <Typography className="text-primary-1">
            {data.diagnosaKerja || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Icd10
          </Typography>
          <Typography className="text-primary-1">
            {data.icd10 || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Rencana
          </Typography>
          <Typography className="text-primary-1">
            {data.rencana || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Tindakan
          </Typography>
          <Typography className="text-primary-1">
            {data.tindakan || "-"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DataDiagnosaAkhir;
