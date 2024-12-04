import Typography from "@/components/elements/Typography";
import clsxm from "@/lib/clsxm";
import sendRequest from "@/lib/getApi";
import { KunjunganTerkini } from "@/types/entities/statistic";
import { useEffect, useState } from "react";

const StatisticRecentKunjungan = ({ className }: { className?: string }) => {
  const [data, setData] = useState<KunjunganTerkini>();

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `statistic/kunjungan/terkini`
      );

      if (isSuccess) {
        const data = responseData as KunjunganTerkini;
        setData(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={clsxm("grid grid-cols-1 md:grid-cols-2 gap-10", className)}>
      <section className="data-section">
        <Typography variant="h6" className="text-primary-1">
          Kunjungan Terkini
        </Typography>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Typography variant="p2" className="font-medium text-gray-500">
              Jumlah kunjungan pasien hari ini
            </Typography>
            <Typography variant="p1" className="font-bold text-primary-1">
              {data?.jumlahToday || 0}
            </Typography>
          </div>
          <div className="flex justify-between items-center">
            <Typography variant="p2" className="font-medium text-gray-500">
              Rata-rata jumlah pasien per minggu di bulan ini
            </Typography>
            <Typography variant="p1" className="font-bold text-primary-1">
              {data?.rataanBulan || 0}
            </Typography>
          </div>
        </div>
      </section>
      <section className="data-section">
        <Typography variant="h6" className="text-primary-1">
          Status Kunjungan Terkini
        </Typography>
        <div className="flex flex-col gap-4 mt-4">
          <div className="px-6 py-2 rounded-lg bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 flex items-center justify-between text-white">
            <Typography variant="p2" className="text-white font-medium">
              Belum dilayani
            </Typography>
            <Typography variant="h7" className="text-white font-bold">
              {data?.jumlahBelumDilayani || 0}
            </Typography>
          </div>
          <div className="px-6 py-2 rounded-lg bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 flex items-center justify-between text-white">
            <Typography variant="p2" className="text-white font-medium">
              Sedang dilayani
            </Typography>
            <Typography variant="h7" className="text-white font-bold">
              {data?.jumlahSedangDilayani || 0}
            </Typography>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatisticRecentKunjungan;
