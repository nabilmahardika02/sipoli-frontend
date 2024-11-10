import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // Supaya pasien gabisa edit
import { Pasien } from "@/types/entities/profile";
import { UpdateRekamMedisForm } from "@/types/forms/rekamMedisForm";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

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
  const user = useAuthStore.useUser(); // ambil data user dari auth store, Supaya pasien gabisa edit

  const methods = useForm<UpdateRekamMedisForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

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
        methods.reset();
        setTrigger(!trigger);
      }
    };

    postData();
  };

  useEffect(() => {
    if (pasien) {
      methods.setValue(
        "darahTinggi",
        pasien.riwayatPenyakitKeluarga.darahTinggi
      );
      methods.setValue("tumor", pasien.riwayatPenyakitKeluarga.tumor);
      methods.setValue("ginjal", pasien.riwayatPenyakitKeluarga.ginjal);
      methods.setValue(
        "gangguanJiwa",
        pasien.riwayatPenyakitKeluarga.gangguanJiwa
      );
      methods.setValue(
        "penyakitJantung",
        pasien.riwayatPenyakitKeluarga.penyakitJantung
      );
      methods.setValue(
        "kencingManisKeluarga",
        pasien.riwayatPenyakitKeluarga.kencingManis
      );
      methods.setValue(
        "riwayatKeluargaLainnya",
        pasien.riwayatPenyakitKeluarga.lainnya
      );
    }
  }, [pasien, methods]);

  return (
    <section className="p-5 md:p-8 rounded-xl bg-white border border-gray-200 shadow-md">
      <section>
        <div className="flex max-md:justify-between gap-5 items-center">
          <Typography variant="h6" className="text-primary-1">
            Data Riwayat Penyakit Keluarga
          </Typography>
          {["DOKTER", "PERAWAT"].includes(user?.role) && ( // Supaya pasien gabisa edit
          <IconButton
            icon={LuPencil}
            variant="primary"
            onClick={() => setShowModal(true)}
          />
          )}
        </div>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Darah Tinggi
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.darahTinggi || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Penyakit Jantung
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.penyakitJantung || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Tumor
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.tumor || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Ginjal
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.ginjal || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Gangguan Jiwa
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.gangguanJiwa || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Kencing Manis
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitKeluarga.kencingManis || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
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
              Edit Data Riwayat Penyakit Keluarga
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    id="darahTinggi"
                    placeholder="Darah Tinggi"
                    label="Darah Tinggi"
                  />
                  <Input
                    id="penyakitJantung"
                    placeholder="Penyakit Jantung"
                    label="Penyakit Jantung"
                  />
                  <Input id="tumor" placeholder="Tumor" label="Tumor" />
                  <Input id="ginjal" placeholder="Ginjal" label="Ginjal" />
                  <Input
                    id="gangguanJiwa"
                    placeholder="Gangguan Jiwa"
                    label="Gangguan Jiwa"
                  />
                  <Input
                    id="kencingManisKeluarga"
                    placeholder="Kencing Manis"
                    label="Kencing Manis"
                  />
                  <Input
                    id="riwayatKeluargaLainnya"
                    placeholder="lainnya"
                    label="lainnya"
                  />
                </div>
                <Button type="submit" className="max-md:w-full">
                  Save
                </Button>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </section>
  );
};

export default DataRiwayatKeluarga;
