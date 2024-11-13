import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
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
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateHasilKunjunganForm>({
    mode: "onTouched",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateHasilKunjunganForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/basic-info`,
        data,
        true
      );

      if (isSuccess) {
        setShowModal(false);
        methods.reset();
        setTrigger(!trigger);
      }
    };

    postData();
  };

  useEffect(() => {
    if (data) {
      methods.setValue("keluhanUtama", data.keluhanUtama);
      methods.setValue("riwayatPenyakitSekarang", data.riwayatPenyakitSekarang);
      methods.setValue("kie", data.kie);
    }
  }, [data, methods]);

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
            onClick={() => setShowModal(true)}
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
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Komunikasi Informasi dan Edukasi
          </Typography>
          <Typography className="text-primary-1">{data.kie || "-"}</Typography>
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
                  <Input
                    id="kie"
                    placeholder="Komunikasi Informasi dan Edukasi"
                    label="Komunikasi Informasi dan Edukasi"
                  />
                </div>
                <Button type="submit" className="max-md:w-full">
                  Simpan
                </Button>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default DataUtama;
