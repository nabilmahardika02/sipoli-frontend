import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import Typography from "@/components/elements/Typography";
import { HasilPemeriksaanForm, KuantitasObatRequest } from "@/types/forms/hasilPemeriksaanForm";
import { Obat } from "@/types/entities/obat";
import { Kunjungan } from "@/types/entities/kunjungan";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import sendRequest from "@/lib/getApi";

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
  const methods = useForm<HasilPemeriksaanForm>({
    mode: "onTouched",
    defaultValues: {
      listKuantitasObat: hasilPemeriksaan.listKuantitasObat || [{ obatId: "", kuantitas: 0, petunjukPemakaian: "" }],
      resepObatRujukan: hasilPemeriksaan.resepObatRujukan || ""
    }
  });

  const { handleSubmit, getValues, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "listKuantitasObat"
  });
  const [obatList, setObatList] = useState<Obat[]>([]);

  useEffect(() => {
    const fetchObatList = async () => {
      const [responseData, message, isSuccess] = await sendRequest("get", "obat/available");
      if (isSuccess) setObatList(responseData as Obat[]);
    };

    fetchObatList();
  }, []);

  useEffect(() => {
    if (hasilPemeriksaan) {
      methods.setValue("listKuantitasObat", hasilPemeriksaan.listKuantitasObat || []);
      methods.setValue("resepObatRujukan", hasilPemeriksaan.resepObatRujukan || "");
    }
  }, [hasilPemeriksaan, methods]);

  const onSubmit: SubmitHandler<HasilPemeriksaanForm> = (data) => {
    setHasilPemeriksaan((prev) => ({
      ...prev,
      listKuantitasObat: data.listKuantitasObat,
      resepObatRujukan: data.resepObatRujukan,
    }));

    setSection(6); // Pindah ke section berikutnya
  };

  const handlePrev = () => {
    const currentValues = getValues();
    setHasilPemeriksaan((prev) => ({
      ...prev,
      listKuantitasObat: currentValues.listKuantitasObat,
      resepObatRujukan: currentValues.resepObatRujukan,
    }));

    setSection(4); // Kembali ke section sebelumnya
  };

  return (
    <section>
      <Typography variant="h7" className="text-primary-1">
        Resep Obat - {kunjungan.profile.name}
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            {fields.map((item, index) => (
              <div key={item.id} className="border p-4 grid grid-cols-1 md:grid-cols-1 gap-5 mb-2 rounded-md"> 
                <SelectInput
                  id={`listKuantitasObat.${index}.obatId`}
                  placeholder="Pilih Obat"
                  label={`Obat ${index + 1}`}
                  {...methods.register(`listKuantitasObat.${index}.obatId` as const)}
                >
                  {obatList.map((obat) => (
                    <option key={obat.id} value={obat.id}>
                      {obat.namaObat}
                    </option>
                  ))}
                </SelectInput>
                <Input
                  id={`listKuantitasObat.${index}.kuantitas`}
                  type="number"
                  placeholder="Kuantitas"
                  label="Kuantitas"
                  {...methods.register(`listKuantitasObat.${index}.kuantitas` as const)}
                />
                <Input
                  id={`listKuantitasObat.${index}.petunjukPemakaian`}
                  placeholder="Petunjuk Pemakaian"
                  label="Petunjuk Pemakaian"
                  {...methods.register(`listKuantitasObat.${index}.petunjukPemakaian` as const)}
                />
                <Button
                  variant="danger" 
                  onClick={() => remove(index)}>
                  Hapus Obat
                </Button>
              </div>
            ))}
          </div >
          <Button 
            variant="primary" 
            onClick={() => append({ obatId: "", kuantitas: 0, petunjukPemakaian: "" })} 
            className="mb-4"
          >
            Tambah Obat
          </Button>
          <Input
            id="resepObatRujukan"
            placeholder="Resep Obat di Luar Klinik"
            label="Resep Obat di Luar Klinik"
            {...methods.register("resepObatRujukan")}
          />
          <div className="flex items-center gap-3 mt-5">
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

export default HasilPemeriksaan5Form;
