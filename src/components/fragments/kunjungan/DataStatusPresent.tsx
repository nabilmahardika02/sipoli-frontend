import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
import { HasilPemeriksaan, Kunjungan } from "@/types/entities/kunjungan";
import { StatusPresent } from "@/types/entities/kunjungan";
import { UpdateStatusPresentForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

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
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateStatusPresentForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/status-present`,
        data,
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
      methods.setValue("abd", data.abd);
      methods.setValue("mata", data.mata);
      methods.setValue("telinga", data.telinga);
      methods.setValue("hidung", data.hidung);
      methods.setValue("tonsil", data.tonsil);
      methods.setValue("faring", data.faring);
      methods.setValue("cor", data.cor);
      methods.setValue("pulmo", data.pulmo);
      methods.setValue("ext", data.ext);
      console.log(data);
    }
  }, [data, methods]);

  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Status Present
        </Typography>
        {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
  <IconButton
    icon={LuPencil}
    variant="primary"
    onClick={() => setShowModal(true)}
  />
)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Mata
          </Typography>
          <Typography className="text-primary-1">{data.mata || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Telinga
          </Typography>
          <Typography className="text-primary-1">
            {data.telinga || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Hidung
          </Typography>
          <Typography className="text-primary-1">
            {data.hidung || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Tonsil
          </Typography>
          <Typography className="text-primary-1">
            {data.tonsil || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Faring
          </Typography>
          <Typography className="text-primary-1">
            {data.faring || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Cor
          </Typography>
          <Typography className="text-primary-1">{data.cor || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Pulmo
          </Typography>
          <Typography className="text-primary-1">
            {data.pulmo || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Abd
          </Typography>
          <Typography className="text-primary-1">{data.abd || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
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
                  <Input id="abd" placeholder="Abdomen" label="Abdomen" />
                  <Input id="ext" placeholder="Ekstremitas" label="Ekstremitas" />
                </div>
                <Button type="submit" className="max-md:w-full">
                  Simpan
                </Button>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default DataStatusPresent;
