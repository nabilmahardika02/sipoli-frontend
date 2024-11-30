// ini sebelum pindah KIE ke sini

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
      listKuantitasObat: hasilPemeriksaan.listKuantitasObat || [
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
    },
  });

  const { handleSubmit, getValues, control, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "listKuantitasObat",
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
        "listKuantitasObat",
        hasilPemeriksaan.listKuantitasObat || []
      );
      methods.setValue(
        "resepObatRujukan",
        hasilPemeriksaan.resepObatRujukan || { deskripsi: "" }
      );
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

      setValue(`listKuantitasObat.${index}.namaObat`, selectedObat.namaObat);
      setValue(
        `listKuantitasObat.${index}.tanggalKadaluarsa`,
        formatDateOnly(closestExpiryDate)
      );
      setValue(`listKuantitasObat.${index}.jenisSatuan`, jenisSatuan);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <Typography variant="h7" className="text-primary-1">
          Formulir 5
        </Typography>
        <Divider />
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
                    id={`listKuantitasObat.${index}.obatId`}
                    placeholder="Pilih Obat"
                    label={`Obat ${index + 1}`}
                    {...methods.register(
                      `listKuantitasObat.${index}.obatId` as const,
                      {
                        onChange: (e) =>
                          handleObatChange(index, e.target.value),
                      }
                    )}
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
                      id={`listKuantitasObat.${index}.tanggalKadaluarsa`}
                      placeholder="Tanggal Kadaluarsa"
                      label="Tanggal Kadaluarsa"
                      value={methods.getValues(
                        `listKuantitasObat.${index}.tanggalKadaluarsa`
                      )}
                      readOnly
                    />
                    <Input
                      id={`listKuantitasObat.${index}.jenisSatuan`}
                      placeholder="Jenis Satuan"
                      label="Jenis Satuan"
                      value={methods.getValues(
                        `listKuantitasObat.${index}.jenisSatuan`
                      )}
                      readOnly
                    />
                  </div>

                  <Input
                    id={`listKuantitasObat.${index}.kuantitas`}
                    type="number"
                    placeholder="Kuantitas"
                    label="Kuantitas"
                    {...methods.register(
                      `listKuantitasObat.${index}.kuantitas` as const
                    )}
                  />
                  <Input
                    id={`listKuantitasObat.${index}.petunjukPemakaian`}
                    placeholder="Petunjuk Pemakaian"
                    label="Petunjuk Pemakaian"
                    {...methods.register(
                      `listKuantitasObat.${index}.petunjukPemakaian` as const
                    )}
                  />
                  <Button variant="danger" onClick={() => remove(index)}>
                    Hapus Obat
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
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
              className="mb-4"
            >
              Tambah Obat
            </Button>
            <TextArea
              id="resepObatRujukan.deskripsi"
              placeholder="Resep Obat di Luar Klinik"
              label="Resep Obat di Luar Klinik"
              {...methods.register("resepObatRujukan.deskripsi" as const)}
            />
            <div className="flex items-center gap-3 mt-4">
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
      </div>
      <Divider />

      {/* Kotak kedua untuk tampilan read-only daftar obat */}
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////


// SEBELUM ADA JENIS SATUAN

import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import DataTable from "@/lib/datatable";
import { formatDateOnly } from "@/lib/formater";
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
      listKuantitasObat: hasilPemeriksaan.listKuantitasObat || [
        { obatId: "", namaObat: "", kuantitas: 0, petunjukPemakaian: "", tanggalKadaluarsa: "" },
      ],
      resepObatRujukan: hasilPemeriksaan.resepObatRujukan || { deskripsi: "" },
    },
  });

  const { handleSubmit, getValues, control, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "listKuantitasObat",
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
        "listKuantitasObat",
        hasilPemeriksaan.listKuantitasObat || []
      );
      methods.setValue(
        "resepObatRujukan",
        hasilPemeriksaan.resepObatRujukan || { deskripsi: "" }
      );
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

  const handleObatChange = (index: number, obatId: string) => {
    const selectedObat = obatList.find((obat) => obat.id === obatId);
    if (selectedObat) {
      const closestExpiryDate =
      selectedObat.listRestockObat && selectedObat.listRestockObat.length > 0
        ? selectedObat.listRestockObat
            .map((restock) => restock.tanggalKadaluarsa)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
        : "Tidak tersedia";    
      setValue(`listKuantitasObat.${index}.namaObat`, selectedObat.namaObat);
      setValue(
        `listKuantitasObat.${index}.tanggalKadaluarsa`,
        formatDateOnly(closestExpiryDate)
      );
      
    }
  };
  
  return (
    <section className="space-y-8">
      <div>
        <Typography variant="h7" className="text-primary-1">
          Formulir 5
        </Typography>
        <Divider />
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
                    id={`listKuantitasObat.${index}.obatId`}
                    placeholder="Pilih Obat"
                    label={`Obat ${index + 1}`}
                    {...methods.register(
                      `listKuantitasObat.${index}.obatId` as const,
                      {
                        onChange: (e) =>
                          handleObatChange(index, e.target.value),
                      }
                    )}
                  >
                    {obatList.map((obat) => (
                      <option key={obat.id} value={obat.id}>
                        {obat.namaObat}
                      </option>
                    ))}
                  </SelectInput>


                  <Input
                    id={`listKuantitasObat.${index}.tanggalKadaluarsa`}
                    placeholder="Tanggal Kadaluarsa"
                    label="Tanggal Kadaluarsa"
                    value={methods.getValues(`listKuantitasObat.${index}.tanggalKadaluarsa`)} // ambil nilai tgl kadaluarsanya
                    readOnly
                  />

                  
                  <Input
                    id={`listKuantitasObat.${index}.kuantitas`}
                    type="number"
                    placeholder="Kuantitas"
                    label="Kuantitas"
                    {...methods.register(
                      `listKuantitasObat.${index}.kuantitas` as const
                    )}
                  />
                  <Input
                    id={`listKuantitasObat.${index}.petunjukPemakaian`}
                    placeholder="Petunjuk Pemakaian"
                    label="Petunjuk Pemakaian"
                    {...methods.register(
                      `listKuantitasObat.${index}.petunjukPemakaian` as const
                    )}
                  />
                  <Button variant="danger" onClick={() => remove(index)}>
                    Hapus Obat
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              onClick={() =>
                append({
                  obatId: "",
                  namaObat: "",
                  kuantitas: 0,
                  petunjukPemakaian: "",
                  tanggalKadaluarsa: "",
                })
              }
              className="mb-4"
            >
              Tambah Obat
            </Button>
            <TextArea
              id="resepObatRujukan.deskripsi"
              placeholder="Resep Obat di Luar Klinik"
              label="Resep Obat di Luar Klinik"
              {...methods.register("resepObatRujukan.deskripsi" as const)}
            />
            <div className="flex items-center gap-3 mt-4">
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
      </div>
      <Divider />

      {/* Kotak kedua untuk tampilan read-only daftar obat */}
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



//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////



// hasilpemeriksaan 1 form masih ada kie


import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import { checkRole } from "@/lib/checkRole";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { Kunjungan } from "@/types/entities/kunjungan";
import {
  HasilKunjunganForm,
  HasilPemeriksaanForm,
} from "@/types/forms/hasilPemeriksaanForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const HasilPemeriksaan1Form = ({
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
  const router = useRouter();

  if (!checkRole(["PERAWAT", "DOKTER"])) {
    router.push("/403");
  }

  const [dokters, setDokters] = useState<Account[]>();
  const methods = useForm<HasilKunjunganForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if (hasilPemeriksaan) {
      methods.setValue("dokter", hasilPemeriksaan.dokter);
      methods.setValue("keluhanUtama", hasilPemeriksaan.keluhanUtama);
      methods.setValue(
        "riwayatPenyakitSekarang",
        hasilPemeriksaan.riwayatPenyakitSekarang
      );
      methods.setValue("kie", hasilPemeriksaan.kie);
      methods.setValue("tanggalPeriksa", hasilPemeriksaan.tanggalPeriksa);
    }
  }, [hasilPemeriksaan, methods]);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/users?role=DOKTER"
      );

      if (isSuccess) {
        setDokters(responseData as Account[]);
      }
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<HasilKunjunganForm> = (data) => {
    setHasilPemeriksaan((prevState) => ({
      ...prevState,
      dokter: data.dokter,
      keluhanUtama: data.keluhanUtama,
      riwayatPenyakitSekarang: data.riwayatPenyakitSekarang,
      kie: data.kie,
      tanggalPeriksa: data.tanggalPeriksa,
    }));

    setSection(2);
  };

  return (
    <section>
      <Typography variant="h7" className="text-primary-1">
        Formulir 1
      </Typography>
      <Divider></Divider>
      <Typography variant="h7" className="mt-5 text-primary-1">
        Data Kunjungan - {kunjungan.profile.name}
      </Typography>
      {dokters ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <SelectInput
                id="dokter"
                placeholder="Pilih Dokter"
                validation={{ required: "Mohon pilih dokter yang menangani" }}
                label="Dokter"
                {...methods.register("dokter")}
              >
                {dokters?.map((dokter) => (
                  <option
                    key={dokter.listProfile[0].id}
                    value={dokter.listProfile[0].id}
                  >
                    {dokter.listProfile[0].name}
                  </option>
                ))}
              </SelectInput>
              <Input
                id="tanggalPeriksa"
                type="datetime-local"
                placeholder="Tanggal Periksa"
                label="Tanggal Periksa"
                defaultValue={new Date(kunjungan.tanggalPeriksa)
                  .toISOString()
                  .slice(0, 16)}
                {...methods.register("tanggalPeriksa")}
              />
              <Input
                id="keluhanUtama"
                placeholder="Keluhan Utama"
                label="Keluhan Utama"
                {...methods.register("keluhanUtama")}
              />
              <Input
                id="riwayatPenyakitSekarang"
                placeholder="Riwayat Penyakit dari Keluhan Utama"
                label="Riwayat Penyakit dari Keluhan Utama"
                {...methods.register("riwayatPenyakitSekarang")}
              />
              <TextArea
                id="kie"
                placeholder="Komunikasi Informasi dan Edukasi"
                label="Komunikasi Informasi dan Edukasi"
                {...methods.register("kie")}
              />
            </div>
            <div className="flex items-center gap-3">
              <Link href={"/kunjungan/" + router.query.id}>
                <Button className="max-md:w-full" variant="danger">
                  Batal
                </Button>
              </Link>
              <Button type="submit" className="max-md:w-full">
                Berikutnya
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <LoadingDiv />
      )}
    </section>
  );
};

export default HasilPemeriksaan1Form;




//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// dataresepobatbelumadakie

import Divider from "@/components/elements/Divider";
import Typography from "@/components/elements/Typography";
import { formatDateOnly } from "@/lib/formater";
import { getSatuanObat } from "@/lib/formater"; // Fungsi untuk mendapatkan jenis satuan
import { KuantitasObat } from "@/types/entities/kuantitasObat";
import { ResepObatRujukan } from "@/types/entities/kunjungan";

const DataResepObat = ({
  listKuantitasObat,
  resepObatRujukan,
}: {
  listKuantitasObat: KuantitasObat[];
  resepObatRujukan?: ResepObatRujukan;
}) => {
  return (
    <div>
      <Divider weight="thin" className="my-5" />
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Resep Obat
        </Typography>
      </div>

      {listKuantitasObat.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {listKuantitasObat.map((kuantitasObat, index) => {
            const closestExpiryDate =
              kuantitasObat.obat.listRestockObat?.length > 0
                ? kuantitasObat.obat.listRestockObat
                    .map((restock) => restock.tanggalKadaluarsa)
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
                : null;

            const jenisSatuan = getSatuanObat(kuantitasObat.obat.jenisSatuan);

            return (
              <div key={index} className="border p-3 rounded-lg mb-2">
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Obat
                </Typography>
                <Typography className="text-primary-1">
                  {kuantitasObat.obat.namaObat || "-"}
                </Typography>

                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400 mt-2"
                >
                  Kuantitas
                </Typography>
                <Typography className="text-primary-1">
                  {kuantitasObat.kuantitas} {jenisSatuan}
                </Typography>

                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400 mt-2"
                >
                  Tanggal Kadaluarsa
                </Typography>
                <Typography className="text-primary-1">
                  {closestExpiryDate ? formatDateOnly(closestExpiryDate) : "Tidak tersedia"}
                </Typography>

                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400 mt-2"
                >
                  Petunjuk Pemakaian
                </Typography>
                <Typography className="text-primary-1">
                  {kuantitasObat.petunjukPemakaian || "-"}
                </Typography>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Pasien tidak diberikan obat dari klinik
          </Typography>
        </div>
      )}

      {resepObatRujukan?.deskripsi && (
        <div className="border p-3 rounded-lg mt-3">
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Resep Obat di Luar Klinik
          </Typography>
          <Typography className="text-primary-1">
            {resepObatRujukan.deskripsi}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default DataResepObat;



//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////


// data utama

import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
import { HasilPemeriksaan } from "@/types/entities/kunjungan";
import { UpdateHasilKunjunganForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

const DataUtama = ({
  data,
  idPemeriksaan,
  trigger,
  setTrigger,
}: {
  data: HasilPemeriksaan;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateHasilKunjunganForm>({
    mode: "onTouched",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateHasilKunjunganForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/basic-info`,
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
      methods.setValue("keluhanUtama", data.keluhanUtama);
      methods.setValue("riwayatPenyakitSekarang", data.riwayatPenyakitSekarang);
      methods.setValue("kie", data.kie);
    }
  }, [data, methods]);

  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Data Pemeriksaan Utama
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
            Keluhan Utama
          </Typography>
          <Typography className="text-primary-1">
            {data.keluhanUtama || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Riwayat Penyakit Sekarang
          </Typography>
          <Typography className="text-primary-1">
            {data.riwayatPenyakitSekarang || "-"}
          </Typography>
        </div>
        <div>
          <Typography variant="p2" weight="semibold" className="text-gray-400">
            Komunikasi Informasi dan Edukasi
          </Typography>
          <Typography className="text-primary-1">{data.kie || "-"}</Typography>
        </div>
      </div>
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Pemeriksaan Utama
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 items-end"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <Input
                    id="keluhanUtama"
                    placeholder="Keluhan Utama"
                    label="Keluhan Utama"
                  />
                  <Input
                    id="riwayatPenyakitSekarang"
                    placeholder="Riwayat Keluhan / Penyakit Saat Ini"
                    label="Riwayat Keluhan / Penyakit Saat Ini"
                  />
                  <Input
                    id="kie"
                    placeholder="Komunikasi Informasi dan Edukasi"
                    label="Komunikasi Informasi dan Edukasi"
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

export default DataUtama;
