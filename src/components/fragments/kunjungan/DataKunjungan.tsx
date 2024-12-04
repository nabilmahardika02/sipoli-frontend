import Typography from "@/components/elements/Typography";
import { sesi, status } from "@/content/kunjungan";
import { formatDate, formatDateOnly } from "@/lib/formater";
import { Kunjungan } from "@/types/entities/kunjungan";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const getSesiText = (sesiValue: number | undefined) => {
  const sesiItem = sesi.find((item) => Number(item.value) === sesiValue);
  return sesiItem ? sesiItem.text : "Sesi tidak tersedia";
};

const getStatusText = (statusValue: number | undefined) => {
  const statusItem = status.find((item) => Number(item.value) === statusValue);
  return statusItem?.text;
};

const getStatusColor = (statusValue: number | undefined) => {
  switch (statusValue) {
    case 0:
      return "text-red-500"; // Belum Dilayani
    case 1:
      return "text-blue-500"; // Sedang Dilayani
    case 2:
      return "text-green-500"; // Selesai
    case 3:
      return "text-gray-500"; // Dibatalkan
    default:
      return "text-gray-500"; // Default untuk status yang tidak dikenal
  }
};

const DataKunjungan = ({ kunjungan }: { kunjungan: Kunjungan }) => {
  const [dt, setDt] = useState<DateTime>();

  useEffect(() => {
    const timeZone = "Asia/Makassar";
    setDt(
      DateTime.fromISO(kunjungan.tanggal, { zone: "utc" }).setZone(timeZone)
    );
  }, [kunjungan]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
      <div>
        <Typography variant="p2" weight="semibold" className="text-gray-700">
          Pasien
        </Typography>
        <Typography className="text-primary-1">
          {kunjungan.profile.name}
        </Typography>
      </div>
      <div>
        <Typography variant="p2" weight="semibold" className="text-gray-700">
          Status
        </Typography>
        <Typography
          className={`text-primary-1 ${getStatusColor(kunjungan?.status)}`}
        >
          {getStatusText(kunjungan?.status)}
        </Typography>
      </div>
      {(dt?.weekday === 7 || kunjungan.hasilPemeriksaan) && (
        <>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-700"
            >
              Tanggal Periksa
            </Typography>
            <Typography className="text-primary-1">
              {kunjungan.tanggalPeriksa
                ? formatDate(kunjungan.tanggalPeriksa)
                : "-"}
            </Typography>
          </div>
        </>
      )}
      {kunjungan.hasilPemeriksaan && (
        <>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-700"
            >
              Dokter
            </Typography>
            <Typography className="text-primary-1">
              {kunjungan.dokter.name}
            </Typography>
          </div>
        </>
      )}
      {dt?.weekday !== 7 && !kunjungan.hasilPemeriksaan && (
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Tanggal
          </Typography>
          <Typography className="text-primary-1">
            {formatDateOnly(kunjungan.tanggal)}
          </Typography>
        </div>
      )}
      <div>
        <Typography variant="p2" weight="semibold" className="text-gray-700">
          Keluhan
        </Typography>
        <Typography className="text-primary-1">{kunjungan.keluhan}</Typography>
      </div>
      {kunjungan.antrian && kunjungan.status < 2 && dt?.weekday !== 7 && (
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Sesi
          </Typography>
          <Typography className="text-primary-1">
            {getSesiText(kunjungan?.antrian.sesi)}
          </Typography>
        </div>
      )}
      {kunjungan.antrian && kunjungan.status < 2 && (
        <>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-700"
            >
              No Antrian
            </Typography>
            <Typography className="text-primary-1">
              {kunjungan.antrian.noAntrian}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};

export default DataKunjungan;
