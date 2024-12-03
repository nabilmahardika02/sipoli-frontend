import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import clsxm from "@/lib/clsxm";
import { formatDateWithoutDays, getCurrency } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import { Obat } from "@/types/entities/obat";
import { GeneralStatistic } from "@/types/entities/statistic";
import { axisClasses } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NoDataState from "./NoDataState";

const StatisticRestockPrice = ({
  className = "",
  obatList,
}: {
  className?: string;
  obatList: Obat[] | undefined;
}) => {
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
        `statistic/obat/restock-history?idObat=${selectedObat}`
      );

      if (isSuccess) {
        const data = responseData as GeneralStatistic[];
        setLabels(data.map((item) => item.label));
        setValues(data.map((item) => item.amount));
        setNoData(data.length == 0);
      }
    };

    if (selectedObat) {
      fetchData();
    }
  }, [selectedObat]);

  const setSelectedObatChange = (event: { target: { value: string } }) => {
    setSelectedObat(event.target.value);
  };

  return (
    <section className={clsxm("data-section", className)}>
      <Typography variant="h6" className="text-primary-1">
        Riwayat Harga Beli Satuan Obat
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
                onChange={setSelectedObatChange}
              >
                {obatList.map((obat) => (
                  <option key={obat.id} value={obat.id} className="text-center">
                    {obat.namaObat}
                  </option>
                ))}
              </SelectInput>
            </form>
          </FormProvider>
          {labels && values && noData != null ? (
            !noData ? (
              <div className="flex flex-col justify-center overflow-x-auto">
                <LineChart
                  margin={{ left: 80 }}
                  width={550}
                  height={400}
                  series={[
                    {
                      curve: "linear",
                      data: values,
                      label: "Harga Beli Satuan",
                      showMark: true,
                      color: "#296a91",
                      //@ts-ignore
                      valueFormatter: (v) => getCurrency(v),
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Harga Beli Satuan",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: labels,
                      label: "Tanggal Pembelian",
                      valueFormatter: (v) => formatDateWithoutDays(v),
                    },
                  ]}
                  sx={{
                    ".MuiLineElement-root": {
                      display: "ruby-base",
                    },
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                      transform: "translate(-30px, 0)",
                    },
                  }}
                  grid={{ vertical: true, horizontal: true }}
                />
              </div>
            ) : (
              <NoDataState
                msg="Belum ada riwayat pembelian"
                className="h-full"
              />
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

export default StatisticRestockPrice;
