import Typography from "@/components/elements/Typography";
import IconButton from "@/components/elements/IconButton";
import ModalLayout from "@/components/layouts/ModalLayout";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import sendRequest from "@/lib/getApi";
import { ResepObatRujukan } from "@/types/entities/kunjungan";
import { UpdateResepObatRujukanForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const DataResepObatRujukan = ({ data, idPemeriksaan, trigger, setTrigger }: {
  data: ResepObatRujukan;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateResepObatRujukanForm>({
    mode: "onTouched",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateResepObatRujukanForm> = (formData) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `kunjungan/${idPemeriksaan}/resep-obat-rujukan`,
        formData,
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
      methods.setValue("id", data.id);
      methods.setValue("deskripsi", data.deskripsi);
      console.log(data);
    }
  }, [data, methods]);

  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Resep atau Obat Rujukan
        </Typography>
        <IconButton
          icon={LuPencil}
          variant="primary"
          onClick={() => setShowModal(true)}
        />
      </div>
      {data?.id || data?.deskripsi ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              ID
            </Typography>
            <Typography className="text-primary-1">
              {data.id || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Deskripsi
            </Typography>
            <Typography className="text-primary-1">
              {data.deskripsi || "-"}
            </Typography>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Pasien tidak memiliki resep atau obat rujukan
          </Typography>
        </div>
      )}

      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Resep atau Obat Rujukan
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input id="id" placeholder="ID" label="ID" />
                  <Input id="deskripsi" placeholder="Deskripsi" label="Deskripsi" />
                </div>
                <Button type="submit" className="max-md:w-full">
                  Save
                </Button>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default DataResepObatRujukan;
