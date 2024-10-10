import { useForm, FormProvider } from "react-hook-form";
import Input from "@/components/elements/forms/Input";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import Button from "@/components/elements/Button";
import ModalLayout from "@/components/layouts/ModalLayout"; // Tambahkan untuk modal
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RekamMedis } from "@/types/entities/rekamMedis";
import { Kunjungan } from "@/types/entities/kunjungan";
import { checkRole } from "@/lib/checkRole";
import useAuthStore from "@/store/useAuthStore";

const RekamMedisDetailPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const [rekamMedis, setRekamMedis] = useState<RekamMedis | null>(null);
  const [kunjungan, setKunjungan] = useState<Kunjungan | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Tambahkan untuk modal hapus
  const methods = useForm(); // Tambahkan ini
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setTitle("Detail Rekam Medis");
  }, [setTitle]);

  useEffect(() => {
    if (router.isReady && id) {
      const fetchRekamMedis = async () => {
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          `rekam-medis/read/${id}`
        );
        if (isSuccess) {
          setRekamMedis(responseData as RekamMedis);
        } else {
          alert("Gagal mendapatkan data rekam medis");
        }
      };
      fetchRekamMedis();
    }
  }, [router.isReady, id]);

  useEffect(() => {
    if (rekamMedis) {
      const fetchKunjungan = async () => {
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          `kunjungan/read-by-rekam-medis-id?rekamMedisId=${rekamMedis.id}`
        );
        if (isSuccess) {
          setKunjungan(responseData as Kunjungan);
        } else {
          alert("Gagal mendapatkan data kunjungan");
        }
      };
      fetchKunjungan();
    }
  }, [rekamMedis]);

  const handleDelete = async () => {
    try {
      const [responseData, message, isSuccess] = await sendRequest(
        "put", // Method DELETE untuk menghapus rekam medis
        `rekam-medis/delete/${id}`,
        null,
        true
      );

      if (isSuccess) {
        setShowDeleteModal(false); 
        router.push("/home"); // Redirect ke daftar rekam medis
      } else {
        alert(message);
      }
    } catch (error) {
      alert("Gagal menghapus rekam medis.");
    }
  };

  if (!rekamMedis || !kunjungan) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...methods}>
      <main>
        <section>
          <Typography variant="h5" weight="bold" className="text-primary-1 mb-5">
            Rekam Medis Pasien
          </Typography>

          {/* Informasi Pasien */}
          <Typography variant="h5" weight="bold" className="mt-8">
            Informasi Pasien
          </Typography>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Input
                id="namaPasien"
                label="Nama Pasien"
                value={kunjungan.profile.name || ""}
                readOnly
              />
            </div>
            <div>
              <Input
                id="tanggalKunjungan"
                label="Tanggal Kunjungan"
                value={new Date(kunjungan.tanggal).toLocaleDateString("id-ID")}
                readOnly
              />
            </div>
          </div>

          {/* Informasi Fisik */}
          <div className="grid grid-cols-2 gap-5 mt-5">
            <Input
              id="tinggiBadan"
              label="Tinggi Badan (cm)"
              type="number"
              value={rekamMedis.tinggiBadan.toString()}
              readOnly
            />
            <Input
              id="beratBadan"
              label="Berat Badan (kg)"
              type="number"
              value={rekamMedis.beratBadan.toString()}
              readOnly
            />
            <Input
              id="tensi"
              label="Tensi Darah (mmHg)"
              value={rekamMedis.tensi}
              readOnly
            />
          </div>

          {/* Keluhan */}
          <Typography variant="h5" weight="bold" className="mt-8">
            Keluhan
          </Typography>
          <TextArea
            id="keluhan"
            label="Detail Keluhan"
            value={kunjungan.keluhan || ""}
            readOnly
          />

          {/* Diagnosis */}
          <Typography variant="h5" weight="bold" className="mt-8">
            Diagnosis
          </Typography>
          <TextArea
            id="diagnosis"
            label="Detail Diagnosis"
            value={rekamMedis.diagnosis}
            readOnly
          />

          {/* Obat */}
          <Typography variant="h5" weight="bold" className="mt-8">
            Obat yang Diberikan
          </Typography>
          {rekamMedis.listKuantitasObat.length > 0 ? (
            <table className="table-auto w-full mt-5 border-collapse border border-gray-300">
              <thead>
                <tr className="text-center bg-primary-1 text-white">
                  <th className="border border-gray-300 p-2">No</th>
                  <th className="border border-gray-300 p-2">Nama Obat</th>
                  <th className="border border-gray-300 p-2">Kuantitas</th>
                </tr>
              </thead>
              <tbody>
                {/* {rekamMedis.listKuantitasObat.map((obat, index) => (
                  <tr key={obat.obat.id} className="text-center">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{obat.obat.namaObat}</td>
                    <td className="border border-gray-300 p-2">{obat.kuantitas}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          ) : (
            <Typography>Tidak ada obat yang diberikan.</Typography>
          )}

          {/* Diagnosis */}
          <Typography variant="h5" weight="bold" className="mt-8">
            Resep Obat
          </Typography>
          <TextArea
            id="deskripsiResepObat"
            label="Detail Resep Obat"
            value={rekamMedis.deskripsiResepObat}
            readOnly
          />

          {/* Rujukan */}
              <Typography variant="h5" weight="bold" className="mt-8">
                Rujukan
              </Typography>
              <div className="grid grid-cols-3 gap-5">
                <Input
                  id="tujuanRujukan"
                  label="Rumah Sakit"
                  value={rekamMedis.tujuanRujukan || ""}
                  readOnly
                />
                <Input
                  id="dokterRujukan"
                  label="Dokter"
                  value={rekamMedis.dokterRujukan || ""}
                  readOnly
                />
                <Input
                  id="catatanRujukan"
                  label="Catatan"
                  value={rekamMedis.catatanRujukan || ""}
                  readOnly
                />
          </div>

          {/* Tombol Edit dan Hapus */}
          {user?.role === "OPERATOR" && (
          <div className="mt-5 flex justify-left gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push(`/rekam-medis/detail/${id}/update`)}
            >
              Edit Rekam Medis
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Hapus Rekam Medis
            </Button>
          </div>
        )}

          {/* Modal Hapus */}
          {showDeleteModal && (
            <ModalLayout setShowModal={setShowDeleteModal}>
              <div className="bg-white rounded-xl p-5 w-full md:w-[50%]">
                <Typography variant="h6" className="text-primary-1">
                  Hapus Rekam Medis
                </Typography>
                <Typography variant="p2" className="text-secondary-4 mt-2">
                  Apakah Anda yakin ingin menghapus rekam medis ini? Data yang
                  dihapus tidak dapat dikembalikan.
                </Typography>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="danger" onClick={handleDelete}>
                    Hapus
                  </Button>
                  <Button variant="success" onClick={() => setShowDeleteModal(false)}>
                    Batal
                  </Button>
                </div>
              </div>
            </ModalLayout>
          )}
        </section>
      </main>
    </FormProvider>
  );
};

export default withAuth(RekamMedisDetailPage, "user");
