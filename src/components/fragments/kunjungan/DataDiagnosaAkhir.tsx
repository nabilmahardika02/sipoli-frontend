import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
import { DiagnosaAkhir } from "@/types/entities/kunjungan";
import { UpdateDiagnosaAkhirForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { FiCheckSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const DataDiagnosaAkhir = ({
  data,
  idPemeriksaan,
  trigger,
  setTrigger,
}: {
  data: DiagnosaAkhir;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateDiagnosaAkhirForm>({
    mode: "onTouched",
  });
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<UpdateDiagnosaAkhirForm> = (formData) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/diagnosa-akhir`,
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

  const handleOpenModal = () => {
    reset({
      icd10: data.icd10 || "",
      diagnosaKerja: data.diagnosaKerja || "",
      rencana: data.rencana || "",
      tindakan: data.tindakan || "",
    });
    setShowModal(true);
  };

  return (
    <div>
      <Divider weight="thin" className="my-5" />
      <div className="mt-5 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary-1"></div>
    <Typography className="text-primary-1 font-semibold">Diagnosa Akhir</Typography>
  </div>
  {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
    <Button
  className="text-xs h-8 w-auto"
  leftIcon={LuPencil}
  onClick={handleOpenModal}
  variant="primary"
>
  Ubah
</Button>

  )}
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            ICD10
          </Typography>
          <Typography className="text-primary-1">
            {data.icd10 || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Diagnosa Kerja
          </Typography>
          <Typography className="text-primary-1">
            {data.diagnosaKerja || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Rencana
          </Typography>
          <Typography className="text-primary-1">
            {data.rencana || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Tindakan
          </Typography>
          <Typography className="text-primary-1">
            {data.tindakan || "-"}
          </Typography>
        </div>
      </div>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Diagnosa Akhir
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input id="icd10" placeholder="ICD10" label="ICD10" />
                  <Input
                    id="diagnosaKerja"
                    placeholder="Diagnosa Kerja"
                    label="Diagnosa Kerja"
                  />
                  <Input id="rencana" placeholder="Rencana" label="Rencana" />
                  <Input
                    id="tindakan"
                    placeholder="Tindakan"
                    label="Tindakan"
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
    </div>
  );
};

export default DataDiagnosaAkhir;
