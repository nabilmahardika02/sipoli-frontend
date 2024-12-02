import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import { months } from "@/content/date";
import clsxm from "@/lib/clsxm";
import sendRequest from "@/lib/getApi";
import { Obat } from "@/types/entities/obat";
import { GeneralStatistic } from "@/types/entities/statistic";
import { axisClasses } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NoDataState from "./NoDataState";

const StatisticPemakaianByObat = ({
  className = "",
  obatList,
}: {
  className?: string;
  obatList: Obat[] | undefined;
}) => {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(12);
  const [selectedObat, setSelectedObat] = useState<string>();

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
        `statistic/obat/pemakaian-by-obat?year=${year}&month=${month}&idObat=${selectedObat}`
      );

      if (isSuccess) {
        const data = responseData as GeneralStatistic[];
        setLabels(data.map((item) => item.label));
        setValues(data.map((item) => item.amount));
        setNoData(data.every((item) => item.amount === 0));
      }
    };

    if (selectedObat) {
      fetchData();
    }
  }, [year, month, selectedObat]);

  const setSelectedObatChange = (event: { target: { value: string } }) => {
    setSelectedObat(event.target.value);
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
        Jumlah Pemakaian Obat Berdasarkan Jenis Obat
      </Typography>
      {obatList ? (
        <>
          <FormProvider {...methods}>
            <form className="w-full flex flex-col md:flex-row items-center justify-start gap-5 my-4">
              <SelectInput
                id="idObat"
                label="Obat"
                placeholder="Pilih Obat"
                className="md:rounded-full text-center"
                parentClassName="md:w-[25%]"
                onChange={setSelectedObatChange}
              >
                {obatList.map((obat) => (
                  <option key={obat.id} value={obat.id} className="text-center">
                    {obat.namaObat}
                  </option>
                ))}
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
              <div className="flex flex-col justify-center overflow-x-auto">
                <LineChart
                  margin={{ left: 60 }}
                  width={1050}
                  height={400}
                  series={[
                    {
                      curve: "linear",
                      data: values,
                      label: "Jumlah Obat Dipakai",
                      showMark: false,
                      color: "#296a91",
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Jumlah Obat Dipakai",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: labels,
                      label: "Rentang tanggal pada bulan terpilih",
                      valueFormatter: (v) => {
                        const tempLabel = v.split(" ");
                        return `${tempLabel[1]}` || v;
                      },
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
              <NoDataState
                msg="Pilih obat terlebih dulu"
                img="/images/folder2.png"
              />
            </div>
          )}
        </>
      ) : (
        <LoadingDiv />
      )}
    </section>
  );
};

export default StatisticPemakaianByObat;
