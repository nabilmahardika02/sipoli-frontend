import Typography from "@/components/elements/Typography";
import Button from "@/components/elements/Button"; // Untuk tombol hapus
import Divider from "@/components/elements/Divider";
import ModalLayout from "@/components/layouts/ModalLayout"; // Untuk modal
import { KuantitasObat } from "@/types/entities/kuantitasObat"; 
import { HasilPemeriksaan } from "@/types/entities/kunjungan";
import { Dispatch, SetStateAction, useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import DataDiagnosaAkhir from "./DataDiagnosaAkhir";
import DataPemeriksaanFisik from "./DataPemeriksaanFisik";
import DataResepObat from "./DataResepObat";
import DataRujukan from "./DataRujukan";
import DataStatusPresent from "./DataStatusPresent";
import DataUtama from "./DataUtama";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit

const DataHasilPemeriksaan = ({
  data,
  trigger,
  setTrigger,
}: {
  data: HasilPemeriksaan;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      const [response, message, isSuccess] = await sendRequest(
        "delete",
        `/hasil-pemeriksaan/delete/${data.id}`,
        null,
        true
      );

      if (isSuccess) {
        // alert("Hasil pemeriksaan berhasil dihapus.");
        setShowDeleteModal(false);
        setTrigger(!trigger); // Refresh data setelah penghapusan
      } else {
        alert(`Gagal menghapus hasil pemeriksaan: ${message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus hasil pemeriksaan.");
    }
  };

  return (
    <section>
      {data ? (
        <>
          <DataUtama
            data={data}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataPemeriksaanFisik
            data={data.pemeriksaanFisik}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataStatusPresent
            data={data.statusPresent}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataDiagnosaAkhir
            data={data.diagnosaAkhir}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataResepObat
            listKuantitasObat={
              data.listKuantitasObat as unknown as KuantitasObat[]
            }
            resepObatRujukan={data.resepObatRujukan}
            data={data}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataRujukan
            data={data.rujukan}
            idPemeriksaan={data.id}
            trigger={trigger}
            setTrigger={setTrigger}
          />
{["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
  <>
    <Divider weight="thin" className="my-5" />
    <div className="flex justify-center gap-2 mt-7 mb-3">
      <Button
        leftIconClassName="max-md:text-md max-md:mr-0"
        leftIcon={IoTrashBin}
        variant="danger"
        onClick={() => setShowDeleteModal(true)}
      >
        Hapus Hasil Pemeriksaan
      </Button>
    </div>
  </>
)}
        </>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Belum ada hasil pemeriksaan
          </Typography>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <ModalLayout setShowModal={setShowDeleteModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
            <Typography variant="h6" className="text-primary-1">
              Konfirmasi Hapus
            </Typography>
            <Divider className="my-2" weight="kurus" />
            <Typography
              variant="p2"
              weight="semibold"
              className="text-secondary-4"
            >
              Apakah Anda yakin ingin menghapus hasil pemeriksaan ini?
            </Typography>
            <Typography variant="p2" className="text-primary-1 mt-2">
              <ul className="list-disc pl-4">
                <li>Data hasil pemeriksaan yang dihapus tidak dapat dikembalikan.</li>
                <li>Pastikan Anda yakin sebelum melanjutkan penghapusan.</li>
              </ul>
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Hapus
              </Button>
            </div>
          </div>
        </ModalLayout>
      )}
    </section>
  );
};

export default DataHasilPemeriksaan;
