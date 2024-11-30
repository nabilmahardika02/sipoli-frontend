import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import Typography from "@/components/elements/Typography";
import { Kunjungan } from "@/types/entities/kunjungan";
import { HasilPemeriksaanForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const HasilPemeriksaan3Form = ({
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
      methods.setValue("mata", hasilPemeriksaan.mata);
      methods.setValue("telinga", hasilPemeriksaan.telinga);
      methods.setValue("hidung", hasilPemeriksaan.hidung);
      methods.setValue("tonsil", hasilPemeriksaan.tonsil);
      methods.setValue("faring", hasilPemeriksaan.faring);
      methods.setValue("cor", hasilPemeriksaan.cor);
      methods.setValue("pulmo", hasilPemeriksaan.pulmo);
      methods.setValue("abd", hasilPemeriksaan.abd);
      methods.setValue("ext", hasilPemeriksaan.ext);
    }
  }, [hasilPemeriksaan, methods]);

  const onSubmit: SubmitHandler<HasilPemeriksaanForm> = (data) => {
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      mata: data.mata,
      telinga: data.telinga,
      hidung: data.hidung,
      tonsil: data.tonsil,
      faring: data.faring,
      cor: data.cor,
      pulmo: data.pulmo,
      abd: data.abd,
      ext: data.ext,
    }));

    setSection(4);
  };

  const handlePrev = () => {
    const currentValues = getValues();
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      mata: currentValues.mata,
      telinga: currentValues.telinga,
      hidung: currentValues.hidung,
      tonsil: currentValues.tonsil,
      faring: currentValues.faring,
      cor: currentValues.cor,
      pulmo: currentValues.pulmo,
      abd: currentValues.abd,
      ext: currentValues.ext,
    }));

    setSection(2);
  };

  return (
    <section>
      <Typography variant="h7" className="text-primary-1">
        Formulir 3
      </Typography>
      <Divider weight="thin" className="my-5" />
      <Typography variant="h7" className="mt-5 text-primary-1">
        Status Present - {kunjungan.profile.name}
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
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
          <div className="flex items-center gap-3">
            <Button
              className="max-md:w-full"
              variant="danger"
              onClick={handlePrev}
            >
              Kembali
            </Button>
            <Button type="submit" className="max-md:w-full">
              Berikutnya
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default HasilPemeriksaan3Form;
