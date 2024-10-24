import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
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
    <section className="p-5 md:p-8 rounded-xl bg-white border border-gray-200 shadow-md">
      <section>
        <div className="flex max-md:justify-between gap-5 items-center">
          <Typography variant="h6" className="text-primary-1">
            Data Kebiasaan
          </Typography>
          <IconButton
            icon={LuPencil}
            variant="primary"
            onClick={() => setShowModal(true)}
          />
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
              Edit Data Kebiasaan
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    id="olahraga"
                    placeholder="Kebiasaan Olahraga"
                    label="Kebiasaan Olahraga"
                  />
                  <Input
                    id="merokok"
                    placeholder="Kebiasaan Merokok"
                    label="Kebiasaan Merokok"
                  />
                  <Input
                    id="alkohol"
                    placeholder="Kebiasaan Alkohol"
                    label="Kebiasaan Alkohol"
                  />
                  <Input
                    id="obatObatan"
                    placeholder="Kebiasaan Obat-Obatan"
                    label="Kebiasaan Obat-Obatan"
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

export default DataKebiasaan;
