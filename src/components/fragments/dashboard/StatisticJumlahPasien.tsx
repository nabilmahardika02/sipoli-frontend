import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import clsxm from "@/lib/clsxm";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { GeneralStatistic, PieChartData } from "@/types/entities/statistic";
import {
  getRowIdStatistic,
  statisticTableColumn,
} from "@/types/table/statistiColumn";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NoDataState from "./NoDataState";

function getTotalAmount(data: GeneralStatistic[]): number {
  return data.reduce((total, item) => total + item.amount, 0);
}

function convertToPieChartData(data: GeneralStatistic[]): PieChartData[] {
  const totalAmount = getTotalAmount(data);

  return data.map((item, index) => ({
    id: index,
    label: item.label,
    value: (item.amount / totalAmount) * 100,
  }));
}

const StatisticJumlahPasien = ({ className = "" }: { className?: string }) => {
  const [byAttribute, setAttribute] = useState("gender");

  const [noData, setNoData] = useState<boolean>();
  const [data, setData] = useState<GeneralStatistic[]>();
  const [dataPercentage, setDataPercentage] = useState<PieChartData[]>();
  const [chartHeight, setChartheight] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setChartheight(500);
      } else {
        setChartheight(300);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `statistic/patient?by=${byAttribute}`
      );

      if (isSuccess) {
        const dataRes = responseData as GeneralStatistic[];
        setData(dataRes);
        setDataPercentage(convertToPieChartData(dataRes));
        setNoData(dataRes.every((item) => item.amount === 0));
      }
    };

    fetchData();
  }, [byAttribute]);

  const setSelectedAttribute = (event: { target: { value: string } }) => {
    setAttribute(event.target.value);
  };

  const methods = useForm<{ category: string }>({
    mode: "onTouched",
  });

  return (
    <section className={clsxm("data-section", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <Typography variant="h6" className="text-primary-1">
            Data Pasien
          </Typography>
          <Typography variant="p2" className="text-gray-400 font-medium mt-2">
            Data pasien terdaftar
          </Typography>
        </div>
        <div className="w-full md:w-[50%]">
          <FormProvider {...methods}>
            <form>
              <SelectInput
                id="category"
                className="rounded-full"
                onChange={setSelectedAttribute}
              >
                <option className="text-center" value="gender">
                  Jenis Kelamin
                </option>
                <option className="text-center" value="relative">
                  Relatif
                </option>
                <option className="text-center" value="age">
                  Usia
                </option>
              </SelectInput>
            </form>
          </FormProvider>
        </div>
      </div>
      {data && noData != null ? (
        !noData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
            {dataPercentage ? (
              <PieChart
                series={[
                  {
                    // @ts-ignore
                    data: dataPercentage,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "#721E49",
                    },
                    valueFormatter: (v) =>
                      v === null ? "" : `${v.value.toFixed(2)} %`,
                  },
                ]}
                width={chartHeight}
                height={300}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "middle" },
                    padding: 0,
                    labelStyle: {
                      fontSize: 14,
                    },
                    itemMarkWidth: 11,
                    itemMarkHeight: 10,
                  },
                }}
                margin={{ top: 0, bottom: 70, left: 0, right: 0 }}
              />
            ) : (
              <LoadingDiv />
            )}
            <div>
              <DataTable
                columns={statisticTableColumn}
                rows={data}
                getRowId={getRowIdStatistic}
                flexColumnIndexes={[0, 1]}
              />
            </div>
          </div>
        ) : (
          <NoDataState msg="Belum ada pasien terdaftar" />
        )
      ) : (
        <LoadingDiv />
      )}
    </section>
  );
};

export default StatisticJumlahPasien;
