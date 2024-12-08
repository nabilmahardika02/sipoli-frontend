import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import { months } from "@/content/date";
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

const StatisticTopRestock = ({ className = "" }: { className?: string }) => {
  const [month, setMonth] = useState(12);
  const [year, setYear] = useState(2024);

  const [data, setData] = useState<GeneralStatistic[]>();
  const [labels, setLabels] = useState<string[]>();
  const [values, setValues] = useState<number[]>();
  const [noData, setNoData] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `statistic/obat/top-restock?year=${year}&month=${month}`
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
  }, [month, year]);

  const methods = useForm<{}>({
    mode: "onTouched",
  });

  const setSelectedYear = (event: { target: { value: number } }) => {
    setYear(event.target.value);
  };
  const setSelectedMonth = (event: { target: { value: number } }) => {
    setMonth(event.target.value);
  };

  return (
    <section className={clsxm("data-section", className)}>
      <Typography variant="h6" className="text-primary-1">
        Obat Paling Banyak Di-Restock
      </Typography>
      <Typography variant="p2" className="text-gray-400 mt-1" weight="medium">
        Menampilkan maksimal 10 obat dengan total kuantitas restock terbanyak
        pada periode bulan dipilih
      </Typography>
      <FormProvider {...methods}>
        <form className="w-full flex flex-col md:flex-row items-center justify-start gap-5 my-4">
          <SelectInput
            id="year"
            label="Tahun"
            className="md:rounded-full"
            parentClassName="md:w-[25%]"
            //@ts-ignore
            onChange={setSelectedYear}
          >
            <option value="2024" className="text-center">
              2024
            </option>
            <option value="2023" className="text-center">
              2023
            </option>
            <option value="2022" className="text-center">
              2022
            </option>
          </SelectInput>
          <SelectInput
            id="bulan"
            label="Bulan"
            className="md:rounded-full"
            parentClassName="md:w-[25%]"
            //@ts-ignore
            onChange={setSelectedMonth}
            defaultValue={12}
          >
            {months.map((month) => (
              <option
                key={month.index}
                value={month.index}
                className="text-center"
              >
                {month.month}
              </option>
            ))}
          </SelectInput>
        </form>
      </FormProvider>
      {labels && values && noData != null ? (
        !noData ? (
          <div className="flex flex-col justify-center overflow-x-auto pb-5">
            <BarChart
              yAxis={[
                {
                  label: "Total Obat Direstock",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: labels,
                  tickLabelStyle: {
                    angle: -20,
                    textAnchor: "end",
                  },
                },
              ]}
              series={[{ data: values }]}
              width={1250}
              height={350}
              colors={["#913275"]}
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

export default StatisticTopRestock;
