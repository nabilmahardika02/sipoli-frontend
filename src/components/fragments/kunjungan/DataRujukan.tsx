import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
import { Rujukan } from "@/types/entities/kunjungan";
import { UpdateRujukanForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { FiCheckSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const DataRujukan = ({
  data,
  idPemeriksaan,
  trigger,
  setTrigger,
}: {
  data: Rujukan;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateRujukanForm>({
    mode: "onTouched",
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<UpdateRujukanForm> = (formData) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/rujukan`,
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
      dokterRujukan: data?.dokter || "",
      tujuanRujukan: data?.tujuan || "",
      catatanRujukan: data?.catatan || "",
    });
    setShowModal(true);
  };
  

  return (
    <div>
      <Divider weight="thin" className="my-5" />
      <div className="mt-5 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary-1"></div>
    <Typography className="text-primary-1 font-semibold">Rujukan</Typography>
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

      {data?.dokter || data?.catatan || data?.maksimalBerlaku || data?.tujuan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Tujuan Rujukan
            </Typography>
            <Typography className="text-primary-1">{data.tujuan || "-"}</Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Dokter Tujuan
            </Typography>
            <Typography className="text-primary-1">{data.dokter || "-"}</Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-700">
              Catatan
            </Typography>
            <Typography className="text-primary-1">{data.catatan || "-"}</Typography>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-700 font-medium">
            Pasien tidak membutuhkan rujukan
          </Typography>
        </div>
      )}

      {/* Modal Form Ubah Data Rujukan */}
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Rujukan
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input id="tujuanRujukan" placeholder="Tujuan Rujukan" label="Tujuan Rujukan" />
                  <Input id="dokterRujukan" placeholder="Dokter Rujukan" label="Dokter Rujukan" />
                  <Input id="catatanRujukan" placeholder="Catatan" label="Catatan" />
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
                      >Simpan
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default DataRujukan;
