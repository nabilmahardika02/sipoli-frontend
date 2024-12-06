import Divider from "@/components/elements/Divider";
import Typography from "@/components/elements/Typography";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { Pasien } from "@/types/entities/profile"; // Ubah import dari Profile ke Pasien
import {
  getRowIdKunjungan,
  kunjunganTables,
} from "@/types/table/hasilPemeriksaanColumn";
import { useEffect, useState } from "react";

const DataDaftarRekamMedis = ({
  pasien,
  trigger,
  setTrigger,
}: {
  pasien: Pasien;
  trigger: boolean;
  setTrigger: (value: boolean) => void;
}) => {
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);

  useEffect(() => {
    const fetchRekamMedis = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `kunjungan/all?profileId=${pasien.id}&hasRekamMedis=true`
      );

      if (isSuccess) {
        setKunjungans(responseData as Kunjungan[]);
      }
    };

    fetchRekamMedis();
  }, [pasien.id, trigger]);

  return (
    <section className="p-5 md:p-8 rounded-xl bg-white border border-gray-200 shadow-md">
      <Typography variant="h6" className="text-primary-1">
        Daftar Hasil Pemeriksaan
      </Typography>
      <Divider />
      {kunjungans.length > 0 ? (
        <DataTable
          columns={kunjunganTables.filter((column) =>
            ["tanggal", "action"].includes(column.field)
          )}
          getRowId={getRowIdKunjungan}
          rows={kunjungans.filter(
            (kunjungan) => kunjungan.profile.id === pasien.id
          )} // Filter by profile ID
          flexColumnIndexes={[0, 1]}
        />
      ) : (
        <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
          <Typography variant="p1" weight="semibold" className="text-gray-400">
            Tidak ada rekam medis yang tersedia untuk pasien ini
          </Typography>
        </div>
      )}
    </section>
  );
};

export default DataDaftarRekamMedis;
