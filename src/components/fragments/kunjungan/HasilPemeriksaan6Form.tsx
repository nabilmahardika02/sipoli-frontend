import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import {
  HasilPemeriksaanForm,
  RujukanForm,
} from "@/types/forms/hasilPemeriksaanForm";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const HasilPemeriksaan5Form = ({
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
  const methods = useForm<RujukanForm>({
    mode: "onTouched",
  });

  const { handleSubmit, getValues } = methods;
  const router = useRouter();

  useEffect(() => {
    if (hasilPemeriksaan.rujukanRequestDTO) {
      methods.setValue(
        "tujuanRujukan",
        hasilPemeriksaan.rujukanRequestDTO.tujuanRujukan
      );
      methods.setValue(
        "dokterRujukan",
        hasilPemeriksaan.rujukanRequestDTO.dokterRujukan
      );
      methods.setValue(
        "catatanRujukan",
        hasilPemeriksaan.rujukanRequestDTO.catatanRujukan
      );
    }
  }, [hasilPemeriksaan, methods]);

  const onSubmit: SubmitHandler<RujukanForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "/hasil-pemeriksaan/add/" + router.query.id,
        {
          ...hasilPemeriksaan,
          rujukanRequestDTO: {
            tujuanRujukan: data.tujuanRujukan,
            dokterRujukan: data.dokterRujukan,
            catatanRujukan: data.catatanRujukan,
          },
        },
        true
      );

      if (isSuccess) {
        router.push("/kunjungan/" + router.query.id);
      }
    };

    postData();
  };

  const handlePrev = () => {
    const currentValues = getValues();
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      rujukanRequestDTO: {
        tujuanRujukan: currentValues.tujuanRujukan,
        dokterRujukan: currentValues.dokterRujukan,
        catatanRujukan: currentValues.catatanRujukan,
      },
    }));

    setSection(5);
  };

  return (
    <section>
      <Typography variant="h7" className="text-primary-1">
        Formulir 6 
      </Typography>
      <Divider></Divider>
      <Typography variant="h7" className="mt-5 text-primary-1">
        Rujukan - {kunjungan.profile.name}
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <Input
              id="tujuanRujukan"
              placeholder="Tujuan Rujukan"
              label="Tujuan Rujukan"
            />
            <Input
              id="dokterRujukan"
              placeholder="Dokter Rujukan"
              label="Dokter Rujukan"
            />
            <TextArea
              id="catatanRujukan"
              placeholder="Catatan Rujukan"
              label="Catatan Rujukan"
            />
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
              Simpan
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default HasilPemeriksaan5Form;
