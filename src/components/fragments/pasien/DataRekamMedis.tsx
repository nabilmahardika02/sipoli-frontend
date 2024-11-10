import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import { calculateAge, formatDate, getJenisKelamin } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // Supaya pasien gabisa edit
import { Pasien } from "@/types/entities/profile";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

const DataRekamMedis = ({
  pasien,
  trigger,
  setTrigger,
}: {
  pasien: Pasien;
  setTrigger: Dispatch<SetStateAction<boolean>>;
  trigger: boolean;
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const user = useAuthStore.useUser(); // ambil data user dari auth store, Supaya pasien gabisa edit

  const methods = useForm<{ noRekamMedis: string }>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<{ noRekamMedis: string }> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "rekam-medis/no-rekam-medis",
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
      methods.setValue("noRekamMedis", pasien.noRekamMedis);
    }
  }, [pasien, methods]);

  return (
    <section className="p-5 md:p-8 rounded-xl bg-white border border-gray-200 shadow-md">
      <section>
        <div className="flex max-md:justify-between gap-5 items-center">
          <Typography variant="h6" className="text-primary-1">
            {pasien.noRekamMedis || "No Rekam medis: -"}
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
              Name
            </Typography>
            <Typography className="text-primary-1">{pasien.name}</Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              NIK
            </Typography>
            <Typography className="text-primary-1">{pasien.nik}</Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Usia
            </Typography>
            <Typography className="text-primary-1">
              {calculateAge(pasien.tanggalLahir)}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Jenis Kelamin
            </Typography>
            <Typography className="text-primary-1">
              {getJenisKelamin(pasien.jenisKelamin)}
            </Typography>
          </div>
          <div>
            <Typography
              variant="p2"
              weight="semibold"
              className="text-gray-400"
            >
              Terakhir Diubah
            </Typography>
            <Typography className="text-primary-1">
              {formatDate(pasien.updatedAt)}
            </Typography>
          </div>
        </div>
      </section>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%]">
            <Typography variant="h6" className="text-primary-1">
              Edit Nomor Rekam Medis
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 flex flex-col gap-2 items-end"
              >
                <Input
                  id="noRekamMedis"
                  placeholder="Nomor Rekam Medis"
                  validation={{ required: "Wajib diisi" }}
                  label="Nomor Rekam Medis"
                />
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

export default DataRekamMedis;
