import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import Typography from "@/components/elements/Typography";
import { Kunjungan } from "@/types/entities/kunjungan";
import { HasilPemeriksaanForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const HasilPemeriksaan4Form = ({
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
  const methods = useForm<HasilPemeriksaanForm>({
    mode: "onTouched",
  });

  const { handleSubmit, getValues } = methods;

  useEffect(() => {
    if (hasilPemeriksaan) {
      methods.setValue("icd10", hasilPemeriksaan.icd10);
      methods.setValue("diagnosaKerja", hasilPemeriksaan.diagnosaKerja);
      methods.setValue("rencana", hasilPemeriksaan.rencana);
      methods.setValue("tindakan", hasilPemeriksaan.tindakan);
    }
  }, [hasilPemeriksaan, methods]);

  const onSubmit: SubmitHandler<HasilPemeriksaanForm> = (data) => {
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      icd10: data.icd10,
      diagnosaKerja: data.diagnosaKerja,
      rencana: data.rencana,
      tindakan: data.tindakan,
    }));

    setSection(5);
  };

  const handlePrev = () => {
    const currentValues = getValues();
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      icd10: currentValues.icd10,
      diagnosaKerja: currentValues.diagnosaKerja,
      rencana: currentValues.rencana,
      tindakan: currentValues.tindakan,
    }));

    setSection(3);
  };

  return (
    <section>
      <Typography variant="h7" className="text-primary-1">
        Diagnosa Akhir - {kunjungan.profile.name}
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <Input id="icd10" placeholder="ICD10" label="ICD10" />
            <Input
              id="diagnosaKerja"
              placeholder="Diagnosa Kerja"
              label="Diagnosa Kerja"
            />
            <Input id="rencana" placeholder="Rencana" label="Rencana" />
            <Input id="tindakan" placeholder="Tindakan" label="Tindakan" />
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="max-md:w-full"
              variant="danger"
              onClick={handlePrev}
            >
              Previous
            </Button>
            <Button type="submit" className="max-md:w-full">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default HasilPemeriksaan4Form;
