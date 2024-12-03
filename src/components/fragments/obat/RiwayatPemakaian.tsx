import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { PemakaianObat } from "@/types/entities/obat";
import { pemakaianObatColumn } from "@/types/table/obatColumn";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RiwayatPemakaian = () => {
  const router = useRouter();

  const [listPemakaian, setListPemakaian] = useState<PemakaianObat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `obat/${router.query.id}/list-pemakaian`
      );
    };
    fetchData();
  }, [router.query.id]);

  return (
    <section className="data-section">
      <Typography
        variant="h6"
        weight="semibold"
        className="text-secondary-2 mb-2"
      >
        Riwayat Pemakaian
      </Typography>
      {listPemakaian ? (
        listPemakaian.length > 0 ? (
          <div className="mt-4">
            <DataTable
              columns={pemakaianObatColumn}
              rows={listPemakaian}
              flexColumnIndexes={[2]}
            />
          </div>
        ) : (
          <Typography className="text-gray-500 p-4 rounded-lg border border-gray-300 w-full text-center">
            Belum ada riwayat pemakaian
          </Typography>
        )
      ) : (
        <LoadingDiv />
      )}
    </section>
  );
};

export default RiwayatPemakaian;
