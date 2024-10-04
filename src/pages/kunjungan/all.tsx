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
import { SandboxForm } from "@/types/forms/SandboxForm";
import axios from "axios";
import Typography from "@/components/elements/Typography";

const KunjunganAllPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const methods = useForm<SandboxForm>({
    mode: "onTouched",
  });
  
  if (!checkRole(["OPERATOR", "PERAWAT", "DOKTER"])) {
    return <Forbidden/>;
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
        setKunjungans(responseData as Kunjungan[]); // Set data profil ke state
      }

      console.log("Data yang diterima:", responseData); 
    };

    fetchKunjungans();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Mencegah reload halaman
    await onSubmit();
  };

  const onSubmit = async () => {
    try {
      const response = await axios.get(`/kunjungan/all`, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      setKunjungans(response.data.result); // Mengupdate state dengan data yang diterima
    } catch (error) {
      console.error("Error fetching kunjungan:", error);
    }
  };

  return (
    <main>
      <section className="mt-5">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="my-5">
          <div className="flex justify-center items-center gap-2">
            <Input
              id="startDate"
              label="Tanggal Awal"
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Typography variant="p4">sampai</Typography>
            <Input
              id="endDate"
              label="Tanggal Akhir"
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button type="submit" className="h-full py-[calc(0.375rem+1px)] px-4">Cari</Button>
            </div>
          </form>
          
        </FormProvider>
        <div className="w-full flex items-center justify-end gap-4 my-5">
        <Link href={"/kunjungan/add"}>
          <Button leftIcon={GoPlus}>Tambah</Button>
        </Link>
      </div>
        <div className="w-full flex items-center justify-end gap-4">
          {kunjungans && (
            <DataTable
              columns={kunjunganTables}
              getRowId={getRowIdKunjungan}
              rows={kunjungans}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default withAuth(KunjunganAllPage, "user");
