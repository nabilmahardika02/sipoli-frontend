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

const DataKebiasaan = ({
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
        "rekam-medis/update?section=KEBIASAAN",
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
      methods.setValue("merokok", pasien.kebiasaan.merokok);
      methods.setValue("alkohol", pasien.kebiasaan.alkohol);
      methods.setValue("obatObatan", pasien.kebiasaan.obatObatan);
      methods.setValue("olahraga", pasien.kebiasaan.olahraga);
    }
  }, [pasien, methods]);

  return (
    <section className="data-section">
      <section>
      <div className="flex items-center justify-between gap-5">
  <Typography variant="h6" className="text-primary-1">
    Data Kebiasaan
  </Typography>
  {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
    <Button
      className="max-md:aspect-square"
      leftIcon={LuPencil}
      onClick={() => setShowModal(true)}
      variant="primary"
    >
      Ubah
    </Button>
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
              Olahraga
            </Typography>
            <Typography className="text-primary-1">
              {pasien.kebiasaan.olahraga || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Merokok
            </Typography>
            <Typography className="text-primary-1">
              {pasien.kebiasaan.merokok || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Alkohol
            </Typography>
            <Typography className="text-primary-1">
              {pasien.kebiasaan.alkohol || "-"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Obat-Obatan
            </Typography>
            <Typography className="text-primary-1">
              {pasien.kebiasaan.obatObatan || "-"}
            </Typography>
          </div>
        </div>
      </section>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Kebiasaan
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    id="olahraga"
                    placeholder="Olahraga"
                    label="Olahraga"
                  />
                  <Input
                    id="merokok"
                    placeholder="Merokok"
                    label="Merokok"
                  />
                  <Input
                    id="alkohol"
                    placeholder="Alkohol"
                    label="Alkohol"
                  />
                  <Input
                    id="obatObatan"
                    placeholder="Obat-Obatan"
                    label="Obat-Obatan"
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
    </section>
  );
};

export default DataKebiasaan;
