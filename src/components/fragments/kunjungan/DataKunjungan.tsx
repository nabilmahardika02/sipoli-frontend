import Typography from "@/components/elements/Typography";
import { sesi, status } from "@/content/kunjungan";
import { formatDateOnly } from "@/lib/formater";
import { formatDate } from "@/lib/formater";
import { Kunjungan } from "@/types/entities/kunjungan";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
      <div>
        <Typography variant="p2" weight="semibold" className="text-gray-400">
          Pasien
        </Typography>
        <Typography className="text-primary-1">
          {kunjungan.profile.name}
        </Typography>
      </div>
      <div>
        <Typography variant="p2" weight="semibold" className="text-gray-400">
          Status
        </Typography>
        <Typography
          className={`text-primary-1 ${getStatusColor(kunjungan?.status)}`}
        >
          {getStatusText(kunjungan?.status)}
        </Typography>
      </div>
      {(new Date(kunjungan.tanggal).getDay() === 0 || kunjungan.hasilPemeriksaan)&& (
        <>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Tanggal Masuk
            </Typography>
            <Typography className="text-primary-1">
              {kunjungan.tanggalMasuk
                ? formatDate(kunjungan.tanggalMasuk)
                : "-"}
            </Typography>
          </div>
        </>
      )}
      {kunjungan.hasilPemeriksaan && (
        <>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Tanggal Keluar
            </Typography>
            <Typography className="text-primary-1">
              {kunjungan.tanggalKeluar
                ? formatDate(kunjungan.tanggalKeluar)
                : "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Dokter Pengirim
            </Typography>
            <Typography className="text-primary-1">
              {kunjungan.dokterPengirim}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Dokter
            </Typography>
            <Typography className="text-primary-1">
              {kunjungan.dokter.name}
            </Typography>
          </div>
        </>
      )}
      {new Date(kunjungan.tanggal).getDay() !== 0 && !kunjungan.hasilPemeriksaan && (<div>
        <Typography variant="p2" weight="semibold" className="text-gray-400">
          Tanggal
        </Typography>
        <Typography className="text-primary-1">
          {formatDateOnly(kunjungan.tanggal)}
        </Typography>
      </div>)}
      <div>
        <Typography variant="p2" weight="semibold" className="text-gray-400">
          Keluhan
        </Typography>
        <Typography className="text-primary-1">
          {kunjungan.keluhan}
        </Typography>
      </div>
      {kunjungan.antrian && kunjungan.status < 2 && (
        <>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Sesi
            </Typography>
            <Typography className="text-primary-1">
              {getSesiText(kunjungan?.antrian.sesi)}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
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
