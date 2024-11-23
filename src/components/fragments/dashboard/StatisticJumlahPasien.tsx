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
  const [chartHeight, setChartheight] = useState(200);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setChartheight(200);
      } else {
        setChartheight(150);
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

  return (
    <section className={clsxm("data-section", className)}>
      <Typography variant="h6" className="text-primary-1">
        Data Pasien
      </Typography>
      <Typography variant="p2" className="text-gray-400 font-medium mt-2">
        Data pasien terdaftar
      </Typography>
      {data && noData != null ? (
        !noData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
            {dataPercentage ? (
              <PieChart
                colors={["#dc2626", "#2563eb"]}
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
                height={chartHeight}
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
          <NoDataState msg="Belum ada pasien terdaftar"/>
        )
      ) : (
        <LoadingDiv />
      )}
    </section>
  );
};

export default StatisticJumlahPasien;
