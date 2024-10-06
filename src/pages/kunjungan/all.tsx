import withAuth from "@/components/hoc/withAuth";
import Link from "next/link";
import { GoPlus } from "react-icons/go";
import Button from "@/components/elements/Button";
import { useDocumentTitle } from "@/context/Title";
import { useEffect, useState } from "react";
import { Kunjungan } from "@/types/entities/kunjungan";
import DataTable from "@/lib/datatable";
import { getRowIdKunjungan, kunjunganTables } from "@/types/table/kunjunganColumn";
import sendRequest from "@/lib/getApi";
import { checkRole } from "@/lib/checkRole";
import Forbidden from "@/components/fragments/Forbidden";
import Input from "@/components/elements/forms/Input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FilterKunjunganForm } from "@/types/forms/filterKunjunganForm";
import axios from "axios";
import Typography from "@/components/elements/Typography";
import Divider from "@/components/elements/Divider";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";

const KunjunganAllPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
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

  useEffect(() =>{
    // Fungsi untuk mengambil data profil dari API
    const fetchKunjungans = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all",  
              
      );

      if (isSuccess) {
        // Sort data di frontend berdasarkan tanggal (descending)
        const sortedData = (responseData as Kunjungan[]).sort((a, b) => {
          const dateA = new Date(a.tanggal).getTime();
          const dateB = new Date(b.tanggal).getTime();
          return dateB - dateA;  // Urutan descending
        });
  
        setKunjungans(sortedData); // Set data kunjungan yang sudah di-sort
      }

      console.log("Data yang diterima:", responseData); 
    };

    fetchKunjungans();
  }, []);

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FilterKunjunganForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all?startDate="+data.startDate+"&endDate="+data.endDate
      );

      if (isSuccess) {
        setKunjungans(responseData as Kunjungan[]);
      }
    };

    postData();
    };

  return (
    <main>
      <section className="mt-5">
        <div className="flex justify-center md:hidden">
          <Typography variant="h4" className="text-primary-1">Daftar Kunjungan</Typography>
        </div>
        <Divider className="md:hidden"/>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="my-5">
          <div className="flex justify-center items-center gap-2">
            <Input
              id="startDate"
              label="Tanggal Awal"
              type="date"
            />
            <Typography variant="p1" className="mt-6">sampai</Typography>
            <Input
              id="endDate"
              label="Tanggal Akhir"
              type="date"
            />
            <Button type="submit" className="h-full" size="lg" textClassName="my-5 h-full"><FaSearch/></Button>
            </div>
          </form>
          
        </FormProvider>
        <Divider/>
        <div className="w-full flex items-center justify-end gap-4 my-5">
        <Link href={"/kunjungan/add"}>
          <Button leftIcon={GoPlus}>Tambah</Button>
        </Link>
      </div>
        <div className="w-full flex items-center justify-end gap-4">
          {kunjungans && kunjungans.length > 0 ? (
            <DataTable
              columns={kunjunganTables}
              getRowId={getRowIdKunjungan}
              rows={kunjungans}
              sortingOrder={['asc', 'desc']}  // Mengatur urutan sort (ascending, descending)
              initialState={{
                sorting: {
                  sortModel: [
                    {
                      field: 'tanggal',  // Kolom yang akan di-sort
                      sort: 'desc',  // Urutan descending (tanggal terbaru)
                    },
                  ],
                },
              }}
            />
          ) : (
            <Typography variant="h6" className="text-gray-500">Belum ada kunjungan</Typography>
          )}
        </div>
      </section>
    </main>
  );
};

export default withAuth(KunjunganAllPage, "user");
