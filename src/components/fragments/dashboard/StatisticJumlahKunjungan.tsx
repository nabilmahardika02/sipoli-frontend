import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import { months } from "@/content/date";
import clsxm from "@/lib/clsxm";
import sendRequest from "@/lib/getApi";
import { JumlahKunjunganStatistic } from "@/types/entities/statistic";
import { axisClasses } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NoDataState from "./NoDataState";

const StatisticJumlahKunjugan = ({
  className = "",
}: {
  className?: string;
}) => {
  const [periode, setPeriode] = useState("tahunan");
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(1);

  const [jumlahKunjunganData, setJumlahKunjunganData] =
    useState<JumlahKunjunganStatistic[]>();
  const [labels, setLabels] = useState<string[]>();
  const [values, setValues] = useState<number[]>();
  const [noData, setNoData] = useState<boolean>();

  const methods = useForm<{}>({
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `statistic/kunjungan/per-month?periode=${periode}&year=${year}&month=${month}`
      );

      if (isSuccess) {
        const data = responseData as JumlahKunjunganStatistic[];
        setJumlahKunjunganData(data);
        setLabels(data.map((item) => item.period));
        setValues(data.map((item) => item.jumlah));
        setNoData(data.every((item) => item.jumlah === 0));
      }
    };

    fetchData();
  }, [periode, year, month]);

  const setSelectedPeriode = (event: { target: { value: string } }) => {
    setPeriode(event.target.value);
  };
  const setSelectedYear = (event: { target: { value: number } }) => {
    setYear(event.target.value);
  };
  const setSelectedMonth = (event: { target: { value: number } }) => {
    setMonth(event.target.value);
  };

  return (
    <section className={clsxm("data-section", className)}>
      <Typography variant="h6" className="text-primary-1">
        Jumlah Kunjungan
      </Typography>
      <FormProvider {...methods}>
        <form className="w-full flex flex-col md:flex-row items-center justify-start gap-5 my-4">
          <SelectInput
            id="periode"
            label="Periode"
            className="md:rounded-full"
            parentClassName="md:w-[25%]"
            onChange={setSelectedPeriode}
          >
            <option value="tahunan" className="text-center">
              Tahunan
            </option>
            <option value="bulanan" className="text-center">
              Bulanan
            </option>
          </SelectInput>
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
          {periode === "bulanan" && (
            <SelectInput
              id="bulan"
              label="Bulan"
              className="md:rounded-full"
              parentClassName="md:w-[25%]"
              //@ts-ignore
              onChange={setSelectedMonth}
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
          )}
        </form>
      </FormProvider>
      {jumlahKunjunganData && labels && values && noData != null ? (
        !noData ? (
          <div className="flex flex-col justify-center overflow-x-auto">
            <LineChart
              margin={{ left: 60 }}
              width={1000}
              height={400}
              series={[
                {
                  curve: "linear",
                  data: values,
                  label: "Jumlah Kunjungan",
                  showMark: true,
                  color: "#296a91",
                },
              ]}
              yAxis={[
                {
                  label: "Jumlah Kunjungan",
                },
              ]}
              xAxis={[
                {
                  scaleType: "point",
                  data: labels,
                  label:
                    periode === "bulanan"
                      ? "Tanggal Kunjungan"
                      : "Bulan Kunjungan",
                },
              ]}
              sx={{
                ".MuiLineElement-root": {
                  display: "ruby-base",
                },
                [`.${axisClasses.left} .${axisClasses.label}`]: {
                  transform: "translate(-10px, 0)",
                },
              }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>
        ) : (
          <NoDataState />
        )
      ) : (
        <div className="w-full flex justify-center items-center">
          <LoadingDiv />
        </div>
      )}
    </section>
  );
};

export default StatisticJumlahKunjugan;
