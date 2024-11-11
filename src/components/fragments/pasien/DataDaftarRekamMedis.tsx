import { useEffect, useState } from "react";
import DataTable from "@/lib/datatable";
import Typography from "@/components/elements/Typography";
import Divider from "@/components/elements/Divider";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { getRowIdKunjungan, kunjunganTables } from "@/types/table/hasilPemeriksaanColumn";
import { Pasien } from "@/types/entities/profile"; // Ubah import dari Profile ke Pasien

const DataDaftarRekamMedis = ({
    pasien,
    trigger,
    setTrigger,
  }: {
    pasien: Pasien; // Ubah ke tipe Pasien
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
        } else {
          console.error("Failed to fetch rekam medis:", message);
        }
      };
  
      fetchRekamMedis();
    }, [pasien.id, trigger]);
  
    return (
      <section className="p-5 md:p-8 rounded-xl bg-white border border-gray-200 shadow-md">
        <Typography variant="h6" className="text-primary-1">
          Daftar Rekam Medis
        </Typography>
        <Divider />
        {kunjungans.length > 0 ? (
          <DataTable
            columns={kunjunganTables.filter(column => ["tanggal", "action"].includes(column.field))}
            getRowId={getRowIdKunjungan}
            rows={kunjungans.filter(kunjungan => kunjungan.profile.id === pasien.id)} // Filter by profile ID
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
