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
import { FiCheckSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const DataRiwayatKeluarga = ({
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

  // Menyiapkan nilai default
  const prepareDefaultValues = () => ({
    darahTinggi: pasien.riwayatPenyakitKeluarga.darahTinggi || "",
    penyakitJantung: pasien.riwayatPenyakitKeluarga.penyakitJantung || "",
    tumor: pasien.riwayatPenyakitKeluarga.tumor || "",
    ginjal: pasien.riwayatPenyakitKeluarga.ginjal || "",
    gangguanJiwa: pasien.riwayatPenyakitKeluarga.gangguanJiwa || "",
    kencingManisKeluarga: pasien.riwayatPenyakitKeluarga.kencingManis || "",
    riwayatKeluargaLainnya: pasien.riwayatPenyakitKeluarga.lainnya || "",
  });

  // Buka modal dan reset form ke nilai default
  const handleOpenModal = () => {
    reset(prepareDefaultValues());
    setShowModal(true);
  };

  const onSubmit: SubmitHandler<UpdateRekamMedisForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "rekam-medis/update?section=RIWAYATKELUARGA",
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
            Data Riwayat Penyakit Keluarga
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
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Darah Tinggi
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.darahTinggi || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Penyakit Jantung
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.penyakitJantung || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Tumor
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.tumor || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Ginjal
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.ginjal || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Gangguan Jiwa
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.gangguanJiwa || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Kencing Manis
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.kencingManis || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Lainnya
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.lainnya || "-"}
            </Typography>
          </div>
        </div>
      </section>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Riwayat Penyakit Keluarga
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input id="darahTinggi" placeholder="Darah Tinggi" label="Darah Tinggi" />
                  <Input id="penyakitJantung" placeholder="Penyakit Jantung" label="Penyakit Jantung" />
                  <Input id="tumor" placeholder="Tumor" label="Tumor" />
                  <Input id="ginjal" placeholder="Ginjal" label="Ginjal" />
                  <Input id="gangguanJiwa" placeholder="Gangguan Jiwa" label="Gangguan Jiwa" />
                  <Input id="kencingManisKeluarga" placeholder="Kencing Manis" label="Kencing Manis" />
                  <Input id="riwayatKeluargaLainnya" placeholder="Lainnya" label="Lainnya" />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    className="max-md:aspect-square"
                    leftIcon={FiX}
                    variant="danger"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit"
                            className="max-md:aspect-square"
                            leftIcon={FiCheckSquare}
                  >Simpan</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </section>
  );
};

export default DataRiwayatKeluarga;
