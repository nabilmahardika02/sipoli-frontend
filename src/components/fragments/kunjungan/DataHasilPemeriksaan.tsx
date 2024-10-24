import Typography from "@/components/elements/Typography";
import { HasilPemeriksaan } from "@/types/entities/kunjungan";
import DataDiagnosaAkhir from "./DataDiagnosaAkhir";
import DataPemeriksaanFisik from "./DataPemeriksaanFisik";
import DataRujukan from "./DataRujukan";
import DataStatusPresent from "./DataStatusPresent";
import DataUtama from "./DataUtama";

const DataHasilPemeriksaan = ({ data }: { data: HasilPemeriksaan }) => {
  return (
    <section>
      {data ? (
        <>
          <DataUtama data={data} />
          <DataPemeriksaanFisik data={data.pemeriksaanFisik} />
          <DataStatusPresent data={data.statusPresent} />
          <DataDiagnosaAkhir data={data.diagnosaAkhir} />
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
