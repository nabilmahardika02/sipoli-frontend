import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import clsxm from "@/lib/clsxm";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { RujukanStatistic } from "@/types/entities/statistic";
import { rujukanTableColumn } from "@/types/table/statistiColumn";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const StatisticRujukan = ({ className = "" }: { className?: string }) => {
  const [data, setData] = useState<RujukanStatistic[]>();
  const [periode, setPeriode] = useState("bulanan");
  const [month, setMonth] = useState(12);

  const methods = useForm<{}>({
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `statistic/kunjungan/list-rujukan?periode=${periode}&month=${month}`
      );

      if (isSuccess) {
        const data = responseData as RujukanStatistic[];
        setData(data);
      }
    };

    fetchData();
  }, [periode, month]);

  const setSelectedPeriode = (event: { target: { value: string } }) => {
    setPeriode(event.target.value);
  };
  const setSelectedMonth = (event: { target: { value: number } }) => {
    setMonth(event.target.value);
  };

  return (
    <section className={clsxm("data-section flex flex-col gap-4", className)}>
      <div>
        <Typography variant="h6" className="text-primary-1">
          Data Rujukan
        </Typography>
        <Typography variant="p2" className="text-gray-400 font-medium mt-2">
          Data pasien yang dirujuk
        </Typography>
      </div>
      <FormProvider {...methods}>
        <form className="w-full flex flex-col md:flex-row items-center justify-start gap-5">
          <SelectInput
            id="periode"
            label="Periode"
            className="md:rounded-full"
            parentClassName="md:w-[50%]"
            onChange={setSelectedPeriode}
          >
            <option value="bulanan" className="text-center">
              Bulanan
            </option>
            <option value="this-week" className="text-center">
              Minggu Ini
            </option>
            <option value="today" className="text-center">
              Hari Ini
            </option>
          </SelectInput>
          {periode === "bulanan" && (
            <SelectInput
              id="bulan"
              label="Bulan"
              className="md:rounded-full"
              parentClassName="md:w-[50%]"
              //@ts-ignore
              onChange={setSelectedMonth}
              defaultValue={12}
            >
              <option value="1" className="text-center">
                Januari
              </option>
              <option value="2" className="text-center">
                Februari
              </option>
              <option value="3" className="text-center">
                Maret
              </option>
              <option value="4" className="text-center">
                April
              </option>
              <option value="5" className="text-center">
                Mei
              </option>
              <option value="6" className="text-center">
                Juni
              </option>
              <option value="7" className="text-center">
                Juli
              </option>
              <option value="8" className="text-center">
                Agustus
              </option>
              <option value="9" className="text-center">
                September
              </option>
              <option value="10" className="text-center">
                Oktober
              </option>
              <option value="11" className="text-center">
                November
              </option>
              <option value="12" className="text-center">
                Desember
              </option>
            </SelectInput>
          )}
        </form>
      </FormProvider>
      {data ? (
        <>
          <div className="w-full flex items-center gap-1 p-4 border rounded-xl border-gray-300">
            <Typography variant="p2" className="text-gray-500 font-medium">
              Jumlah rujukan:
            </Typography>
            <Typography variant="h7" className="text-primary-1 font-bold">
              {data.length}
            </Typography>
          </div>
          <DataTable
            columns={rujukanTableColumn}
            rows={data}
            showPerPage={[5]}
            initialPageSize={5}
            flexColumnIndexes={[0, 1]}
          />
        </>
      ) : (
        <LoadingDiv />
      )}
    </section>
  );
};

export default StatisticRujukan;
