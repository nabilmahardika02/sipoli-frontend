import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
import { PemeriksaanFisik } from "@/types/entities/kunjungan";
import { UpdatePemeriksaanFisikForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

const DataPemeriksaanFisik = ({
  data,
  idPemeriksaan,
  trigger,
  setTrigger,
}: {
  data: PemeriksaanFisik;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdatePemeriksaanFisikForm>({
    mode: "onTouched",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdatePemeriksaanFisikForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/pemeriksaan-fisik`,
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
      methods.setValue("tensi", data.tensi);
      methods.setValue("suhu", data.suhu);
      methods.setValue("meanArteri", data.meanArteri);
      methods.setValue("respiratoryRate", data.respiratoryRate);
      methods.setValue("heartRate", data.heartRate);
      methods.setValue("oxygenSaturation", data.oxygenSaturation);
      methods.setValue("kesadaran", data.kesadaran);
      methods.setValue("eye", data.eye);
      methods.setValue("verbal", data.verbal);
      methods.setValue("motorik", data.motorik);
    }
  }, [data, methods]);

  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Pemeriksaan Fisik
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
            Temperature
          </Typography>
          <Typography className="text-primary-1">
            {data.suhu + "°C" || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Blood Pressure
          </Typography>
          <Typography className="text-primary-1">
            {data.tensi || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Mean Arterial Pressure
          </Typography>
          <Typography className="text-primary-1">
            {data.meanArteri + "mmHg" || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Respiratory Rate
          </Typography>
          <Typography className="text-primary-1">
            {data.respiratoryRate + "/menit" || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Heart Rate
          </Typography>
          <Typography className="text-primary-1">
            {data.heartRate + "bpm" || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Oxygen Saturation
          </Typography>
          <Typography className="text-primary-1">
            {data.oxygenSaturation + "%" || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Kesadaran
          </Typography>
          <Typography className="text-primary-1">
            {data.kesadaran || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Eye
          </Typography>
          <Typography className="text-primary-1">{data.eye || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Verbal
          </Typography>
          <Typography className="text-primary-1">
            {data.verbal || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Motorik
          </Typography>
          <Typography className="text-primary-1">
            {data.motorik || "-"}
          </Typography>
        </div>
      </div>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Pemeriksaan Fisik
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input id="suhu" type="number" placeholder="Temperature" label="Temperature" />
                  <Input id="tensi" placeholder="Blood Pressure" label="Blood Pressure" />
                  <Input
                    id="meanArteri"
                    type="number"
                    placeholder="Mean Arterial Pressure"
                    label="Mean Arterial Pressure"
                  />
                  <Input
                    id="respiratoryRate"
                    type="number"
                    placeholder="Respiratory Rate"
                    label="Respiratory Rate"
                  />
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="Heart Rate"
                    label="Heart Rate"
                  />
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    placeholder="Oxygen Saturation"
                    label="Oxygen Saturation"
                  />
                  <Input id="kesadaran" placeholder="Kesadaran" label="Kesadaran" />
                  <Input id="eye" type="number" placeholder="Eye" label="Eye" />
                  <Input
                    id="verbal"
                    type="number"
                    placeholder="Verbal"
                    label="Verbal"
                  />
                  <Input
                    id="motorik"
                    type="number"
                    placeholder="Motorik"
                    label="Motorik"
                  />
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

export default DataPemeriksaanFisik;
