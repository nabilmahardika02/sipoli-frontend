import Breadcrumb from "@/components/elements/Breadcrumb";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import Typography from "@/components/elements/Typography";
import { Kunjungan } from "@/types/entities/kunjungan";
import {
  HasilPemeriksaanFisikForm,
  HasilPemeriksaanForm,
} from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";

const HasilPemeriksaan2Form = ({
  hasilPemeriksaan,
  setHasilPemeriksaan,
  setSection,
  kunjungan,
}: {
  hasilPemeriksaan: HasilPemeriksaanForm;
  setHasilPemeriksaan: Dispatch<SetStateAction<HasilPemeriksaanForm>>;
  setSection: Dispatch<SetStateAction<number>>;
  kunjungan: Kunjungan;
}) => {
  const methods = useForm<HasilPemeriksaanFisikForm>({
    mode: "onTouched",
  });

  const { handleSubmit, getValues } = methods;

  useEffect(() => {
    if (hasilPemeriksaan) {
      methods.setValue("tensi", hasilPemeriksaan.tensi);
      methods.setValue("suhu", hasilPemeriksaan.suhu);
      methods.setValue("meanArteri", hasilPemeriksaan.meanArteri);
      methods.setValue("respiratoryRate", hasilPemeriksaan.respiratoryRate);
      methods.setValue("heartRate", hasilPemeriksaan.heartRate);
      methods.setValue("oxygenSaturation", hasilPemeriksaan.oxygenSaturation);
      methods.setValue("kesadaran", hasilPemeriksaan.kesadaran);
      methods.setValue("eye", hasilPemeriksaan.eye);
      methods.setValue("verbal", hasilPemeriksaan.verbal);
      methods.setValue("motorik", hasilPemeriksaan.motorik);
    }
  }, [hasilPemeriksaan, methods]);

  const onSubmit: SubmitHandler<HasilPemeriksaanFisikForm> = (data) => {
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      tensi: data.tensi,
      suhu: data.suhu,
      meanArteri: data.meanArteri,
      respiratoryRate: data.respiratoryRate,
      heartRate: data.heartRate,
      oxygenSaturation: data.oxygenSaturation,
      kesadaran: data.kesadaran,
      eye: data.eye,
      verbal: data.verbal,
      motorik: data.motorik,
    }));

    setSection(3);
  };

  const handlePrev = () => {
    const currentValues = getValues();
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      tensi: currentValues.tensi,
      suhu: currentValues.suhu,
      meanArteri: currentValues.meanArteri,
      respiratoryRate: currentValues.respiratoryRate,
      heartRate: currentValues.heartRate,
      oxygenSaturation: currentValues.oxygenSaturation,
      kesadaran: currentValues.kesadaran,
      eye: currentValues.eye,
      verbal: currentValues.verbal,
      motorik: currentValues.motorik,
    }));

    setSection(1);
  };

  return (
    <section>
      <Breadcrumb
  currentStep={2}
  totalSteps={6}
  onNavigate={(step) => {
    const currentValues = getValues();
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      tensi: currentValues.tensi,
      suhu: currentValues.suhu,
      meanArteri: currentValues.meanArteri,
      respiratoryRate: currentValues.respiratoryRate,
      heartRate: currentValues.heartRate,
      oxygenSaturation: currentValues.oxygenSaturation,
      kesadaran: currentValues.kesadaran,
      eye: currentValues.eye,
      verbal: currentValues.verbal,
      motorik: currentValues.motorik,
    }));
    setSection(step);
  }}
/>
      <Divider weight="thin" className="my-5" />
      <Typography variant="h7" className="mt-5 text-primary-1">
        Pemeriksaan Fisik - {kunjungan.profile.name}
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <Input
              id="suhu"
              type="number"
              placeholder="Temperature"
              label="Temperature (°C)"
              step="0.1" // supaya bisa decimal
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
              step="0.1"
            />
            <Input
              id="respiratoryRate"
              type="number"
              placeholder="Respiratory Rate"
              label="Respiratory Rate (per minute)"
              step="0.1"
            />
            <Input
              id="heartRate"
              type="number"
              placeholder="Heart Rate"
              label="Heart Rate (bpm)"
              step="0.1"
            />
            <Input
              id="oxygenSaturation"
              type="number"
              placeholder="Oxygen Saturation"
              label="Oxygen Saturation (%)"
              step="0.1"
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
          <div className="flex items-center gap-3">
            <Button
              className="max-md:w-full"
              leftIcon={FiChevronLeft}
              variant="danger"
              onClick={() => handlePrev()}
            >
              Kembali
            </Button>
            <Button type="submit" className="max-md:w-full" rightIcon={FiChevronRight}>
              Berikutnya
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default HasilPemeriksaan2Form;
