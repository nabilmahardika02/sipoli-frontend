import Typography from "@/components/elements/Typography";
import { HasilPemeriksaan } from "@/types/entities/kunjungan";
import DataDiagnosaAkhir from "./DataDiagnosaAkhir";
import DataPemeriksaanFisik from "./DataPemeriksaanFisik";
import DataRujukan from "./DataRujukan";
import DataStatusPresent from "./DataStatusPresent";
import DataUtama from "./DataUtama";
import { Dispatch, SetStateAction } from "react";

const DataHasilPemeriksaan = ({
  data,
  trigger,
  setTrigger,
}: {
  data: HasilPemeriksaan;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <section>
      {data ? (
        <>
          <DataUtama
            data={data}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataPemeriksaanFisik
            data={data.pemeriksaanFisik}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataStatusPresent
            data={data.statusPresent}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataDiagnosaAkhir
            data={data.diagnosaAkhir}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataRujukan data={data.rujukan} />
        </>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Belum ada hasil pemeriksaan
          </Typography>
        </div>
      )}
    </section>
  );
};

export default DataHasilPemeriksaan;
