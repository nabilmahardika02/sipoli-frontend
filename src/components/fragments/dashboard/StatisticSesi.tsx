import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import clsxm from "@/lib/clsxm";
import sendRequest from "@/lib/getApi";
import { GeneralStatistic } from "@/types/entities/statistic";
import { axisClasses } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NoDataState from "./NoDataState";

const chartSetting = {
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-10px, 0)",
    },
  },
};

const StatisticSesi = ({ className = "" }: { className?: string }) => {
  const [month, setMonth] = useState(1);

  const [data, setData] = useState<GeneralStatistic[]>();
  const [labels, setLabels] = useState<string[]>();
  const [values, setValues] = useState<number[]>();
  const [noData, setNoData] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `statistic/kunjungan/by-sesi?month=${month}`
      );

      if (isSuccess) {
        const data = responseData as GeneralStatistic[];
        setData(data);
        setLabels(data.map((item) => item.label));
        setValues(data.map((item) => item.amount));
        setNoData(data.every((item) => item.amount === 0));
      }
    };

    fetchData();
  }, [month]);

  const methods = useForm<{}>({
    mode: "onTouched",
  });

  const setSelectedMonth = (event: { target: { value: number } }) => {
    setMonth(event.target.value);
  };

  return (
    <section className={clsxm("data-section", className)}>
      <Typography variant="h6" className="text-primary-1">
        Jumlah Kunjungan Berdasarkan Sesi
      </Typography>
      <Typography variant="p2" className="text-gray-400 font-medium mt-2">
        Data kunjungan pada tahun ini
      </Typography>
      <FormProvider {...methods}>
        <form className="w-full flex flex-col md:flex-row items-center justify-start gap-5 my-4">
          <SelectInput
            id="bulan"
            className="md:rounded-full"
            //@ts-ignore
            onChange={setSelectedMonth}
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
        </form>
      </FormProvider>
      {labels && values && noData != null ? (
        !noData ? (
          <div className="flex flex-col justify-center overflow-x-auto">
            <BarChart
              yAxis={[
                {
                  label: "Jumlah Kunjungan",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: labels,
                },
              ]}
              series={[{ data: values }]}
              width={500}
              height={350}
              colors={["#0f75bc"]}
              grid={{ vertical: true, horizontal: true }}
              {...chartSetting}
            />
          </div>
        ) : (
          <NoDataState />
        )
      ) : (
        <LoadingDiv />
      )}
    </section>
  );
};

export default StatisticSesi;
