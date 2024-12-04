import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Pasien } from "@/types/entities/profile";
import { UpdateRekamMedisForm } from "@/types/forms/rekamMedisForm";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { FiCheckSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";

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
  const user = useAuthStore.useUser();

  const methods = useForm<UpdateRekamMedisForm>({
    mode: "onTouched",
  });

  const { handleSubmit, reset } = methods;

  // Fungsi untuk menyiapkan default values
  const prepareDefaultValues = () => ({
    olahraga: pasien.kebiasaan.olahraga || "",
    merokok: pasien.kebiasaan.merokok || "",
    alkohol: pasien.kebiasaan.alkohol || "",
    obatObatan: pasien.kebiasaan.obatObatan || "",
  });

  const handleOpenModal = () => {
    reset(prepareDefaultValues()); // Reset dengan nilai default
    setShowModal(true);
  };

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
        methods.reset(); // Reset form setelah submit
        setTrigger(!trigger);
      }
    };

    postData();
  };

  return (
    <section className="data-section">
      <div className="flex items-center justify-between gap-5">
        <Typography variant="h6" className="text-primary-1">
          Data Kebiasaan
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
          <Typography
            variant="p2"
            weight="semibold"
            className="text-gray-700"
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
            className="text-gray-700"
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
            className="text-gray-700"
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
            className="text-gray-700"
          >
            Obat-Obatan
          </Typography>
          <Typography className="text-primary-1">
            {pasien.kebiasaan.obatObatan || "-"}
          </Typography>
        </div>
      </div>
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

export default DataKebiasaan;
