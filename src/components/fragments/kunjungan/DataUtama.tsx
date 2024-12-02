import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { HasilPemeriksaan } from "@/types/entities/kunjungan";
import { UpdateHasilKunjunganForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

const DataUtama = ({
  data,
  idPemeriksaan,
  trigger,
  setTrigger,
}: {
  data: HasilPemeriksaan;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser();
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateHasilKunjunganForm>({
    mode: "onTouched",
  });
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<UpdateHasilKunjunganForm> = (formData) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/basic-info`,
        formData,
        true
      );

      if (isSuccess) {
        setShowModal(false);
        setTrigger(!trigger);
      }
    };

    postData();
  };

  // Reset form values when modal is opened
  const handleOpenModal = () => {
    reset({
      keluhanUtama: data.keluhanUtama || "",
      riwayatPenyakitSekarang: data.riwayatPenyakitSekarang || "",
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Data Pemeriksaan Utama
        </Typography>
        {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
          <IconButton
            icon={LuPencil}
            variant="primary"
            onClick={handleOpenModal} // Use the new handleOpenModal function
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Keluhan Utama
          </Typography>
          <Typography className="text-primary-1">
            {data.keluhanUtama || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Riwayat Penyakit Sekarang
          </Typography>
          <Typography className="text-primary-1">
            {data.riwayatPenyakitSekarang || "-"}
          </Typography>
        </div>
      </div>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Pemeriksaan Utama
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    id="keluhanUtama"
                    placeholder="Keluhan Utama"
                    label="Keluhan Utama"
                  />
                  <Input
                    id="riwayatPenyakitSekarang"
                    placeholder="Riwayat Keluhan / Penyakit Saat Ini"
                    label="Riwayat Keluhan / Penyakit Saat Ini"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="danger"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit">Simpan</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default DataUtama;
