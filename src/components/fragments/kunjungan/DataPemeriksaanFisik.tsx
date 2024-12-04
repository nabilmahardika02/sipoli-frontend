import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
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
import { FiCheckSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";

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
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<UpdatePemeriksaanFisikForm> = (formData) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/pemeriksaan-fisik`,
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
      tensi: data.tensi || "", // tetap string karena format tensi bukan angka
      suhu: data.suhu ?? undefined, // gunakan undefined untuk field number jika tidak ada nilai
      meanArteri: data.meanArteri ?? undefined,
      respiratoryRate: data.respiratoryRate ?? undefined,
      heartRate: data.heartRate ?? undefined,
      oxygenSaturation: data.oxygenSaturation ?? undefined,
      kesadaran: data.kesadaran || "",
      eye: data.eye ?? undefined,
      verbal: data.verbal ?? undefined,
      motorik: data.motorik ?? undefined,
    });
    setShowModal(true);
  };  

  return (
    <div>
      <Divider weight="thin" className="my-5" />
      <div className="mt-5 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary-1"></div>
    <Typography className="text-primary-1 font-semibold">Pemeriksaan Fisik</Typography>
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
            Temperature
          </Typography>
          <Typography className="text-primary-1">
            {data.suhu ? `${data.suhu}°C` : "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Blood Pressure
          </Typography>
          <Typography className="text-primary-1">
            {data.tensi || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Mean Arterial Pressure
          </Typography>
          <Typography className="text-primary-1">
            {data.meanArteri ? `${data.meanArteri} mmHg` : "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Respiratory Rate
          </Typography>
          <Typography className="text-primary-1">
            {data.respiratoryRate ? `${data.respiratoryRate}/menit` : "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Heart Rate
          </Typography>
          <Typography className="text-primary-1">
            {data.heartRate ? `${data.heartRate} bpm` : "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Oxygen Saturation
          </Typography>
          <Typography className="text-primary-1">
            {data.oxygenSaturation ? `${data.oxygenSaturation}%` : "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Kesadaran
          </Typography>
          <Typography className="text-primary-1">
            {data.kesadaran || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Eye
          </Typography>
          <Typography className="text-primary-1">{data.eye || "-"}</Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
            Verbal
          </Typography>
          <Typography className="text-primary-1">
            {data.verbal || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-700">
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
                  <Input
                    id="suhu"
                    type="number"
                    placeholder="Temperature"
                    label="Temperature (°C)"
                  />
                  <Input
                    id="tensi"
                    placeholder="Blood Pressure"
                    label="Blood Pressure (mmHg)"
                  />
                  <Input
                    id="meanArteri"
                    type="number"
                    placeholder="Mean Arterial Pressure"
                    label="Mean Arterial Pressure (mmHg)"
                  />
                  <Input
                    id="respiratoryRate"
                    type="number"
                    placeholder="Respiratory Rate"
                    label="Respiratory Rate (per minute)"
                  />
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="Heart Rate"
                    label="Heart Rate (bpm)"
                  />
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    placeholder="Oxygen Saturation"
                    label="Oxygen Saturation (%)"
                  />
                  <Input
                    id="kesadaran"
                    placeholder="Kesadaran"
                    label="Kesadaran"
                  />
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

export default DataPemeriksaanFisik;
