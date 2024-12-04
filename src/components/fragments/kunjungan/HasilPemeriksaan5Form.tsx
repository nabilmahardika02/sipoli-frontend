import Breadcrumb from "@/components/elements/Breadcrumb";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import DataTable from "@/lib/datatable";
import { formatDateOnly, getSatuanObat } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { Obat } from "@/types/entities/obat";
import { HasilPemeriksaanForm } from "@/types/forms/hasilPemeriksaanForm";
import { availableObatTableColumn } from "@/types/table/obatColumn";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { IoTrashBin } from "react-icons/io5";

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
      listKuantitasObatDTO: hasilPemeriksaan.listKuantitasObatDTO || [
        {
          obatId: "",
          namaObat: "",
          kuantitas: 0,
          petunjukPemakaian: "",
          tanggalKadaluarsa: "",
          jenisSatuan: "",
        },
      ],
      resepObatRujukan: hasilPemeriksaan.resepObatRujukan || { deskripsi: "" },
      kie: hasilPemeriksaan.kie || "",
    },
  });  

  const { handleSubmit, getValues, control, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "listKuantitasObatDTO",
  });
  const [obatList, setObatList] = useState<Obat[]>([]);

  useEffect(() => {
    const fetchObatList = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/available"
      );
      if (isSuccess) setObatList(responseData as Obat[]);
    };

    fetchObatList();
  }, []);

  useEffect(() => {
    if (hasilPemeriksaan) {
      methods.setValue(
        "listKuantitasObatDTO",
        hasilPemeriksaan.listKuantitasObatDTO || [] // Mengisi kembali namaObat dan lainnya
      );
      methods.setValue(
        "resepObatRujukan",
        hasilPemeriksaan.resepObatRujukan || { deskripsi: "" }
      );
      methods.setValue("kie", hasilPemeriksaan.kie || "");
    }
  }, [hasilPemeriksaan, methods]);  

  const onSubmit: SubmitHandler<HasilPemeriksaanForm> = (data) => {
    setHasilPemeriksaan((prev) => ({
      ...prev,
      listKuantitasObatDTO: data.listKuantitasObatDTO, // Termasuk namaObat yang sudah dipilih
      resepObatRujukan: data.resepObatRujukan,
      kie: data.kie,
    }));
  
    setSection(6); 
  };
  

  const handlePrev = () => {
    const currentValues = getValues();
    setHasilPemeriksaan((prev) => ({
      ...prev,
      listKuantitasObatDTO: currentValues.listKuantitasObatDTO,
      resepObatRujukan: currentValues.resepObatRujukan,
      kie: currentValues.kie,
    }));
  
    setSection(4); 
  };
  

  const handleObatChange = (index: number, obatId: string) => {
    const selectedObat = obatList.find((obat) => obat.id === obatId);
    if (selectedObat) {
      const closestExpiryDate =
        selectedObat.listRestockObat && selectedObat.listRestockObat.length > 0
          ? selectedObat.listRestockObat
              .map((restock) => restock.tanggalKadaluarsa)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
          : "Tidak tersedia";
  
      const jenisSatuan = getSatuanObat(selectedObat.jenisSatuan);
  
      setValue(`listKuantitasObatDTO.${index}.namaObat`, selectedObat.namaObat); // Simpan namaObat
      setValue(
        `listKuantitasObatDTO.${index}.tanggalKadaluarsa`,
        formatDateOnly(closestExpiryDate)
      );
      setValue(`listKuantitasObatDTO.${index}.jenisSatuan`, jenisSatuan);
    }
  };
  

  const handleNavigate = (step: number) => {
    const currentValues = methods.getValues(); // Ambil nilai form saat ini
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      listKuantitasObatDTO: currentValues.listKuantitasObatDTO,
      resepObatRujukan: currentValues.resepObatRujukan,
      kie: currentValues.kie,
    }));
    setSection(step); // Pindah ke langkah yang dipilih
  };
  

  return (
    <section className="space-y-8">
      <div>
        <Breadcrumb currentStep={5} totalSteps={6} onNavigate={handleNavigate} />
        <Divider weight="thin" className="my-5" />
        <Typography variant="h7" className="mt-5 text-primary-1">
          Resep Obat - {kunjungan?.profile?.name || "Tidak Ada Nama"}
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2 items-end">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="border p-4 grid grid-cols-1 md:grid-cols-1 gap-5 mb-2 rounded-md"
                >
<SelectInput
  id={`listKuantitasObatDTO.${index}.obatId`}
  placeholder="Pilih Obat"
  label={`Obat ${index + 1}`}
  {...methods.register(
    `listKuantitasObatDTO.${index}.obatId` as const,
    {
      onChange: (e) => handleObatChange(index, e.target.value),
    }
  )}
  value={methods.watch(`listKuantitasObatDTO.${index}.obatId`)} // Ambil nilai dari watch
>
  {obatList.map((obat) => (
    <option key={obat.id} value={obat.id}>
      {obat.namaObat}
    </option>
  ))}
</SelectInput>




                  {/* Tanggal Kadaluarsa dan Jenis Satuan sejajar */}
                  <div className="grid grid-cols-2 gap-5">
                    <Input
                      id={`listKuantitasObatDTO.${index}.tanggalKadaluarsa`}
                      placeholder="Tanggal Kadaluarsa"
                      label="Tanggal Kadaluarsa"
                      value={methods.getValues(
                        `listKuantitasObatDTO.${index}.tanggalKadaluarsa`
                      )}
                      readOnly
                    />
                    <Input
                      id={`listKuantitasObatDTO.${index}.jenisSatuan`}
                      placeholder="Jenis Satuan"
                      label="Jenis Satuan"
                      value={methods.getValues(
                        `listKuantitasObatDTO.${index}.jenisSatuan`
                      )}
                      readOnly
                    />
                  </div>

                  <Input
                    id={`listKuantitasObatDTO.${index}.kuantitas`}
                    type="number"
                    placeholder="Kuantitas"
                    label="Kuantitas"
                    {...methods.register(
                      `listKuantitasObatDTO.${index}.kuantitas` as const
                    )}
                  />
                  <Input
                    id={`listKuantitasObatDTO.${index}.petunjukPemakaian`}
                    placeholder="Petunjuk Pemakaian"
                    label="Petunjuk Pemakaian"
                    {...methods.register(
                      `listKuantitasObatDTO.${index}.petunjukPemakaian` as const
                    )}
                  />
                  <Button variant="danger"
                  leftIcon={IoTrashBin}
                   onClick={() => remove(index)}>
                    Hapus Obat
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="primary" leftIcon={FiPlus}
              onClick={() =>
                append({
                  obatId: "",
                  namaObat: "",
                  kuantitas: 0,
                  petunjukPemakaian: "",
                  tanggalKadaluarsa: "",
                  jenisSatuan: "",
                })
              }
              className="mb-6"
            >
              Tambah Obat
            </Button>
            <TextArea
              id="resepObatRujukan.deskripsi"
              placeholder="Resep Obat di Luar Klinik"
              label="Resep Obat di Luar Klinik"
              {...methods.register("resepObatRujukan.deskripsi" as const)}
              className="mb-4"
            />
            <TextArea
              id="kie"
              placeholder="Komunikasi Informasi dan Edukasi"
              label="Komunikasi Informasi dan Edukasi"
              {...methods.register("kie" as const)}
            />
            <div className="flex items-center gap-3 mt-4">
              <Button
                className="max-md:w-full"
                leftIcon={FiChevronLeft}
                variant="danger"
                onClick={handlePrev}
              >
                Kembali
              </Button>
              <Button type="submit" className="max-md:w-full" rightIcon={FiChevronRight}>
                Berikutnya
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      <Divider weight="thin" className="my-5" />

      <div>
        <Typography variant="h7" className="text-primary-1 mb-4">
          Daftar Obat Tersedia
        </Typography>
        <DataTable
          columns={availableObatTableColumn}
          rows={obatList}
          flexColumnIndexes={[1, 4]}
        />
      </div>
    </section>
  );
};

export default HasilPemeriksaan5Form;
