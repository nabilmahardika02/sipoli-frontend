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

  const { handleSubmit } = methods;

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
        methods.reset();
        setTrigger(!trigger);
      }
    };

    postData();
  };

  useEffect(() => {
    if (pasien) {
      methods.setValue(
        "tindakanBedah",
        pasien.riwayatPenyakitDahulu.tindakanBedah
      );
      methods.setValue(
        "kelainanJantung",
        pasien.riwayatPenyakitDahulu.kelainanJantung
      );
      methods.setValue(
        "kencingManisPribadi",
        pasien.riwayatPenyakitDahulu.kencingManis
      );
      methods.setValue(
        "kelainanSaluranCerna",
        pasien.riwayatPenyakitDahulu.kelainanSaluranCerna
      );
      methods.setValue("rawatInap", pasien.riwayatPenyakitDahulu.rawatInap);
      methods.setValue(
        "penyakitHati",
        pasien.riwayatPenyakitDahulu.penyakitHati
      );
      methods.setValue("kecelakaan", pasien.riwayatPenyakitDahulu.kecelakaan);
      methods.setValue(
        "riwayatSakitLainnya",
        pasien.riwayatPenyakitDahulu.lainnya
      );
    }
  }, [pasien, methods]);

  return (
    <section className="data-section">
      <section>
        <div className="flex max-md:justify-between gap-5 items-center">
          <Typography variant="h6" className="text-primary-1">
            Data Riwayat Penyakit
          </Typography>
          {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
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
              Tindakan Bedah
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.tindakanBedah || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Kelainan Jantung
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.kelainanJantung || "-"}
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
              {pasien.riwayatPenyakitDahulu.kencingManis || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Kelainan Saluran Pencernaan
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.kelainanSaluranCerna || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Rawat Inap
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.rawatInap || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Hati
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.penyakitHati || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Kecelakaan
            </Typography>
            <Typography className="text-primary-1">
              {pasien.riwayatPenyakitDahulu.kecelakaan || "-"}
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
              {pasien.riwayatPenyakitDahulu.lainnya || "-"}
            </Typography>
          </div>
        </div>
      </section>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Edit Data Riwayat Sakit
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    id="tindakanBedah"
                    placeholder="Tindakan Bedah"
                    label="Tindakan Bedah"
                  />
                  <Input
                    id="kelainanJantung"
                    placeholder="Kelainan Jantung"
                    label="Kelainan Jantung"
                  />
                  <Input
                    id="kencingManisPribadi"
                    placeholder="Kencing Manis"
                    label="Kencing Manis"
                  />
                  <Input
                    id="kelainanSaluranCerna"
                    placeholder="Kelainan Saluran Pencernaan"
                    label="Kelainan Saluran Pencernaan"
                  />
                  <Input
                    id="rawatInap"
                    placeholder="Riwayat Rawat Inap"
                    label="Riwayat Rawat Inap"
                  />
                  <Input
                    id="penyakitHati"
                    placeholder="Penyakit Hati"
                    label="Penyakit Hati"
                  />
                  <Input
                    id="kecelakaan"
                    placeholder="Kecelakaan"
                    label="Kecelakaan"
                  />
                  <Input
                    id="riwayatSakitLainnya"
                    placeholder="Lainnya"
                    label="Lainnya"
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

export default DataRiwayatPenyakit;
