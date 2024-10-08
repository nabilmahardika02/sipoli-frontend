import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { FilterKunjunganForm } from "@/types/forms/kunjunganForm";
import {
  getRowIdKunjungan,
  kunjunganTables,
} from "@/types/table/kunjunganColumn";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { GoPlus } from "react-icons/go";

const KunjunganAllPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const router = useRouter();

  const methods = useForm<FilterKunjunganForm>({
    mode: "onTouched",
  });

  if (!checkRole(["OPERATOR", "PERAWAT", "DOKTER"])) {
    router.push("/403");
  }

  useEffect(() => {
    setTitle("Daftar Kunjungan");
  }, [setTitle]);

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FilterKunjunganForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all?startDate=" + data.startDate + "&endDate=" + data.endDate
      );

      if (isSuccess) {
        setStartDate(data.startDate as string);
        setEndDate(data.endDate as string);
        setKunjungans(responseData as Kunjungan[]);
      }
    };

    postData();
  };

  return (
    <main>
      <section className="mt-5">
        <div className="flex justify-center md:hidden">
          <Typography variant="h4" className="text-primary-1">
            Daftar Kunjungan
          </Typography>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="my-5">
            <div className="flex justify-center items-center max-md:flex-wrap gap-y-1 gap-x-2">
              <Input id="startDate" label="Tanggal Awal" type="date" />
              <Typography variant="p2" className="mt-2 md:mt-6">
                -
              </Typography>

              <Input id="endDate" label="Tanggal Akhir" type="date" />
              <IconButton
                icon={FaSearch}
                type="submit"
                size="lg"
                className="md:place-self-end max-md:mt-4"
              />
            </div>
          </form>
        </FormProvider>
        <Divider />
        <div className="w-full flex items-center justify-end gap-4 my-5">
          <Link href={"/kunjungan/add"}>
            <Button leftIcon={GoPlus}>Tambah</Button>
          </Link>
        </div>

        <div style={{ width: "100%", overflowX: "auto" }}>
          {!startDate || !endDate ? (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography
                variant="p1"
                weight="semibold"
                className="text-gray-400"
              >
                Mohon pilih tanggal awal dan tanggal akhir untuk melihat kunjungan
              </Typography>
            </div>
          ) : kunjungans && kunjungans.length > 0 ? (
            <DataTable
              columns={kunjunganTables}
              getRowId={getRowIdKunjungan}
              rows={kunjungans}
              flexColumnIndexes={[1, 3]}
            />
          ) : (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography
                variant="p1"
                weight="semibold"
                className="text-gray-400"
              >
                Belum ada kunjungan
              </Typography>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default withAuth(KunjunganAllPage, "user");
