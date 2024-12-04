import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
import { StatusPresent } from "@/types/entities/kunjungan";
import { UpdateStatusPresentForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { FiCheckSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const DataStatusPresent = ({
  data,
  idPemeriksaan,
  trigger,
  setTrigger,
}: {
  data: StatusPresent;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateStatusPresentForm>({
    mode: "onTouched",
  });
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<UpdateStatusPresentForm> = (formData) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/status-present`,
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
    // Reset form values to the original data
    reset({
      mata: data.mata || "",
      telinga: data.telinga || "",
      hidung: data.hidung || "",
      tonsil: data.tonsil || "",
      faring: data.faring || "",
      cor: data.cor || "",
      pulmo: data.pulmo || "",
      abd: data.abd || "",
      ext: data.ext || "",
    });
    setShowModal(true);
  };

  return (
    <div>
      <Divider weight="thin" className="my-5" />
      <div className="mt-5 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary-1"></div>
    <Typography className="text-primary-1 font-semibold">Status Present</Typography>
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
            Mata
          </Typography>
          <Typography className="text-primary-1">{data.mata || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Telinga
          </Typography>
          <Typography className="text-primary-1">
            {data.telinga || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Hidung
          </Typography>
          <Typography className="text-primary-1">
            {data.hidung || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Tonsil
          </Typography>
          <Typography className="text-primary-1">
            {data.tonsil || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Faring
          </Typography>
          <Typography className="text-primary-1">
            {data.faring || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Cor
          </Typography>
          <Typography className="text-primary-1">{data.cor || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Pulmo
          </Typography>
          <Typography className="text-primary-1">
            {data.pulmo || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Abd
          </Typography>
          <Typography className="text-primary-1">{data.abd || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Ext
          </Typography>
          <Typography className="text-primary-1">{data.ext || "-"}</Typography>
        </div>
      </div>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Status Present
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input id="mata" placeholder="Mata" label="Mata" />
                  <Input id="telinga" placeholder="Telinga" label="Telinga" />
                  <Input id="hidung" placeholder="Hidung" label="Hidung" />
                  <Input id="tonsil" placeholder="Tonsil" label="Tonsil" />
                  <Input id="faring" placeholder="Faring" label="Faring" />
                  <Input id="cor" placeholder="Cor" label="Cor" />
                  <Input id="pulmo" placeholder="Pulmo" label="Pulmo" />
                  <Input id="abd" placeholder="Abd" label="Abd" />
                  <Input
                    id="ext"
                    placeholder="Ext"
                    label="Ext"
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

export default DataStatusPresent;
