import Button from "@/components/elements/Button";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import {
  getRowIdKunjungans,
  kunjunganTableColumns,
} from "@/types/table/antrianColumn";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";

const HomeNonPasienView = () => {
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>();

  useEffect(() => {
    const fetchKunjungans = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all?isActive=true"
      );

      if (isSuccess) {
        setKunjungans(responseData as Kunjungan[]);
      }
    };

    fetchKunjungans();
  }, []);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-5">
        <Typography variant="h6" className="text-primary-1">
          Daftar Antrian
        </Typography>
        <div className="flex justify-end">
          <Link href={"/kunjungan/add"}>
            <Button leftIcon={GoPlus} leftIconClassName="max-md:mr-0">
              <span className="max-md:hidden">Tambah Kunjungan</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full">
        {kunjungans ? (
          kunjungans.length > 0 ? (
            <DataTable
              columns={kunjunganTableColumns}
              getRowId={getRowIdKunjungans}
              rows={kunjungans}
              flexColumnIndexes={[3, 5]}
            />
          ) : (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography
                variant="p1"
                weight="semibold"
                className="text-gray-400"
              >
                Belum ada Antrian
              </Typography>
            </div>
          )
        ) : (
          <LoadingDiv />
        )}
      </div>
    </section>
  );
};

export default HomeNonPasienView;
