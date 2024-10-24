import Typography from "@/components/elements/Typography";
import { StatusPresent } from "@/types/entities/kunjungan";

const DataStatusPresent = ({ data }: { data: StatusPresent }) => {
  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Status Present
        </Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Abd
          </Typography>
          <Typography className="text-primary-1">{data.abd || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Mata
          </Typography>
          <Typography className="text-primary-1">{data.mata || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Telinga
          </Typography>
          <Typography className="text-primary-1">
            {data.telinga || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Hidung
          </Typography>
          <Typography className="text-primary-1">
            {data.hidung || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Tonsil
          </Typography>
          <Typography className="text-primary-1">
            {data.tonsil || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Faring
          </Typography>
          <Typography className="text-primary-1">
            {data.faring || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Cor
          </Typography>
          <Typography className="text-primary-1">{data.cor || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Pulmo
          </Typography>
          <Typography className="text-primary-1">
            {data.pulmo || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Ext
          </Typography>
          <Typography className="text-primary-1">{data.ext || "-"}</Typography>
        </div>
      </div>
    </div>
  );
};

export default DataStatusPresent;
