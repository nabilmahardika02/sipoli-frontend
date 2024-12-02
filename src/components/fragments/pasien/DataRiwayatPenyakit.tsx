import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // Supaya pasien gabisa edit
import { Pasien } from "@/types/entities/profile";
import { UpdateRekamMedisForm } from "@/types/forms/rekamMedisForm";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

const DataRiwayatPenyakit = ({
  pasien,
  setTrigger,
  trigger,
}: {
  pasien: Pasien;
  setTrigger: Dispatch<SetStateAction<boolean>>;
  trigger: boolean;
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const user = useAuthStore.useUser();

  const methods = useForm<UpdateRekamMedisForm>({
    mode: "onTouched",
  });

  const { handleSubmit, reset } = methods;

  // Fungsi untuk menyiapkan nilai default
  const prepareDefaultValues = () => ({
    tindakanBedah: pasien.riwayatPenyakitDahulu.tindakanBedah || "",
    kelainanJantung: pasien.riwayatPenyakitDahulu.kelainanJantung || "",
    kencingManisPribadi: pasien.riwayatPenyakitDahulu.kencingManis || "",
    kelainanSaluranCerna: pasien.riwayatPenyakitDahulu.kelainanSaluranCerna || "",
    rawatInap: pasien.riwayatPenyakitDahulu.rawatInap || "",
    penyakitHati: pasien.riwayatPenyakitDahulu.penyakitHati || "",
    kecelakaan: pasien.riwayatPenyakitDahulu.kecelakaan || "",
    riwayatSakitLainnya: pasien.riwayatPenyakitDahulu.lainnya || "",
  });

  // Reset nilai form saat membuka modal
  const handleOpenModal = () => {
    reset(prepareDefaultValues());
    setShowModal(true);
  };

  const onSubmit: SubmitHandler<UpdateRekamMedisForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "rekam-medis/update?section=RIWAYATSAKIT",
        {
          ...data,
          profileId: router.query.id,
        },
        true
      );

      if (isSuccess) {
        setShowModal(false);
        setTrigger(!trigger);
      }
    };

    postData();
  };

  return (
    <section className="data-section">
      <section>
        <div className="flex items-center justify-between gap-5">
          <Typography variant="h6" className="text-primary-1">
            Data Riwayat Penyakit
          </Typography>
          {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
            <Button
              className="max-md:aspect-square"
              leftIcon={LuPencil}
              onClick={handleOpenModal}
              variant="primary"
            >
              Ubah
            </Button>
          )}
        </div>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Tindakan Bedah
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.tindakanBedah || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Kelainan Jantung
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.kelainanJantung || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Kencing Manis
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.kencingManis || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Kelainan Saluran Pencernaan
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.kelainanSaluranCerna || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Rawat Inap
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.rawatInap || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Hati
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.penyakitHati || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Kecelakaan
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.kecelakaan || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Lainnya
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.lainnya || "-"}
            </Typography>
          </div>
        </div>
      </section>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Riwayat Sakit
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input id="tindakanBedah" placeholder="Tindakan Bedah" label="Tindakan Bedah" />
                  <Input id="kelainanJantung" placeholder="Kelainan Jantung" label="Kelainan Jantung" />
                  <Input id="kencingManisPribadi" placeholder="Kencing Manis" label="Kencing Manis" />
                  <Input
                    id="kelainanSaluranCerna"
                    placeholder="Kelainan Saluran Pencernaan"
                    label="Kelainan Saluran Pencernaan"
                  />
                  <Input id="rawatInap" placeholder="Riwayat Rawat Inap" label="Riwayat Rawat Inap" />
                  <Input id="penyakitHati" placeholder="Penyakit Hati" label="Penyakit Hati" />
                  <Input id="kecelakaan" placeholder="Kecelakaan" label="Kecelakaan" />
                  <Input id="riwayatSakitLainnya" placeholder="Lainnya" label="Lainnya" />
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="danger" onClick={() => setShowModal(false)}>
                    Batal
                  </Button>
                  <Button type="submit">Simpan</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </section>
  );
};

export default DataRiwayatPenyakit;
