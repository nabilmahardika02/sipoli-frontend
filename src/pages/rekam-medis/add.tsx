import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AddRekamMedisForm } from "@/types/forms/rekamMedisForm";
import { Obat } from "@/types/entities/obat";
import { Kunjungan } from "@/types/entities/kunjungan";
import Link from "next/link";

const RekamMedisAddPage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan | null>(null);
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [obatSelected, setObatSelected] = useState<{ id: string; kuantitas: number }[]>([]);
  const router = useRouter();
  const { kunjunganId } = router.query; // kunjunganId diambil dari query params
  
  useEffect(() => {
    setTitle("Tambah Rekam Medis");
  }, [setTitle]);

useEffect(() => {
  if (router.isReady && kunjunganId) {
    // Lakukan fetch data berdasarkan kunjunganId
    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `kunjungan/read?kunjunganId=${kunjunganId}`
      );
      if (isSuccess) {
        setKunjungan(responseData as Kunjungan);
      } else {
        alert("Gagal mendapatkan data kunjungan");
      }
    };
    fetchKunjungan();
  }
}, [router.isReady, kunjunganId]);
  
  // Fetch available obat
  useEffect(() => {
    const fetchObat = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/available"
      );
      if (isSuccess) {
        setObatList(responseData as Obat[]);
      }
    };

    fetchObat();
  }, []);

  const methods = useForm<AddRekamMedisForm>({
    mode: "onTouched",
  });

  const { handleSubmit, watch, setValue } = methods;

  const onSubmit: SubmitHandler<AddRekamMedisForm> = async (data) => {
    if (!kunjunganId) {
      alert("Parameter kunjunganId is not present!");
      return;
    }
  
    const payload = {
      ...data,
      kuantitasObat: obatSelected.map((obat) => ({
        obatId: obat.id,
        kuantitas: obat.kuantitas,
      })),
    };
  
    // Kirim kunjunganId sebagai query parameter
    const [responseData, message, isSuccess] = await sendRequest(
      "post",
      `rekam-medis/add?kunjunganId=${kunjunganId}`,  // kunjunganId sebagai query parameter
      payload,
      true
    );
  
    if (isSuccess) {
      router.push("/home");
    }
  };
  

  const handleAddObat = () => {
    const obatId = watch("obatId");
    const kuantitas = watch("kuantitasObat");
    if (obatId && kuantitas > 0) {
      setObatSelected([...obatSelected, { id: obatId, kuantitas }]);
      setValue("obatId", ""); // Reset input obat
      setValue("kuantitasObat", ""); // Reset input kuantitas
    }
  };

  const handleRemoveObat = (id: string) => {
    setObatSelected(obatSelected.filter((obat) => obat.id !== id));
  };

  const handleEditObat = (id: string) => {
    const obatToEdit = obatSelected.find((obat) => obat.id === id);
    setValue("obatId", obatToEdit?.id);
    setValue("kuantitasObat", obatToEdit?.kuantitas);
    handleRemoveObat(id); // Hapus dulu sebelum di-edit
  };

  return (
    <main>
      <section>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <Typography variant="h5" weight="bold" className="text-primary-1 mb-5">
              Rekam Medis Pasien
            </Typography>

            {/* Informasi Pasien otomatis diisi dari Kunjungan */}
            <Typography variant="h5" weight="bold" className="mt-8">
            Informasi Pasien
            </Typography>
            {kunjungan && (
            <div className="grid grid-cols-2 gap-5">
                {/* Nama Pasien di sebelah kiri */}
                <div>
                <Input
                    id="namaPasien"
                    label="Nama Pasien"
                    value={kunjungan.profile.name || ""}
                    readOnly
                />
                </div>

                {/* Tanggal Kunjungan di sebelah kanan */}
                <div>
                <Input
                    id="tanggalKunjungan"
                    label="Tanggal Kunjungan"
                    value={new Date(kunjungan.tanggal).toLocaleDateString('id-ID')}
                    readOnly
                />
                </div>
            </div>
            )}


            {/* Tinggi Badan, Berat Badan, Tensi */}
            <div className="grid grid-cols-2 gap-5 mt-5">
              <Input
                id="tinggiBadan"
                label="Tinggi Badan (cm)"
                type="number"
                placeholder="Masukkan Tinggi Badan Pasien (Contoh: 175)"
                validation={{ required: "Tinggi badan wajib diisi" }}
              />
              <Input
                id="beratBadan"
                label="Berat Badan (kg)"
                type="number"
                placeholder="Masukkan Berat Badan Pasien (Contoh: 45)"
                validation={{ required: "Berat badan wajib diisi" }}
              />
            <Input
                id="tensi"
                label="Tensi Darah (mmHg)"
                placeholder="Masukkan Tensi Darah Pasien (Contoh: 120/90)"
                validation={{ required: "Tensi darah wajib diisi" }}
                />
            </div>

            {/* Keluhan */}
            <Typography variant="h5" weight="bold" className="mt-8">
                Keluhan
                </Typography>
                {kunjungan && (
                <div>
                    <TextArea
                    id="keluhan"
                    label="Detail Keluhan"
                    value={kunjungan.keluhan || ""}
                    readOnly
                    />
                </div>
                )}

            {/* Diagnosis */}
            <Typography variant="h5" weight="bold" className="mt-8">
              Diagnosis
            </Typography>
            <TextArea
              id="diagnosis"
              label="Detail Diagnosis"
              placeholder="Masukkan Hasil Diagnosis Pasien"
              validation={{ required: "Diagnosis wajib diisi" }}
            />

{/* Obat */}
<Typography variant="h5" weight="bold" className="mt-8">
  Obat
</Typography>
<div className="grid grid-cols-2 gap-5 items-center">
  <SelectInput
    id="obatId"
    label="Nama Obat"
    placeholder="Pilih Obat"
  >
    {obatList.map((obat) => (
      <option key={obat.id} value={obat.id}>
        {obat.namaObat} (Stok: {obat.totalStok})
      </option>
    ))}
  </SelectInput>

  <Input
    id="kuantitasObat"
    label="Kuantitas"
    type="number"
    placeholder="1"
  />

  {/* Gunakan full-width pada grid untuk tombol */}
  <div className="col-span-2 flex justify-center mt-2">
    <Button type="button" onClick={handleAddObat}>
      + Tambah
    </Button>
  </div>
</div>



{/* Table untuk Obat yang Dipilih */}
{obatSelected.length > 0 && (
  <table className="table-auto w-full mt-5 border-collapse border border-gray-300">
    <thead>
      <tr className="text-center bg-primary-1 text-white">
        <th className="border border-gray-300 p-2">No</th>
        <th className="border border-gray-300 p-2">Nama Obat</th>
        <th className="border border-gray-300 p-2">Kuantitas</th>
        <th className="border border-gray-300 p-2">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {obatSelected.map((obat, index) => {
        const selectedObat = obatList.find((o) => o.id === obat.id);
        return (
          <tr key={obat.id} className="text-center">
            <td className="border border-gray-300 p-2">{index + 1}</td>
            <td className="border border-gray-300 p-2">{selectedObat?.namaObat}</td>
            <td className="border border-gray-300 p-2">{obat.kuantitas}</td>
            <td className="border border-gray-300 p-2">
              <div className="flex justify-center space-x-2">
                <Button
                  type="button"
                  className="shadow-none"
                  onClick={() => handleEditObat(obat.id)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="shadow-none"
                  onClick={() => handleRemoveObat(obat.id)}
                >
                  Hapus
                </Button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
)}

            {/* Resep Obat */}
            <Typography variant="h5" weight="bold" className="mt-8">
              Resep Obat
            </Typography>
            <TextArea
              id="resepObat"
              label="Detail Resep Obat"
              placeholder="Masukkan Resep Obat yang Dibutuhkan Pasien"
              {...methods.register("resepObat")} // Tambahkan ini
            />


            {/* Rujukan */}
            <Typography variant="h5" weight="bold" className="mt-8">
              Rujukan
            </Typography>
            <div className="grid grid-cols-3 gap-5">
            <Input
              id="rujukanRumahSakit"
              label="Rumah Sakit"
              placeholder="Masukkan Nama Rumah Sakit Rujukan"
            />
            <Input
              id="rujukanDokter"
              label="Dokter"
              placeholder="Masukkan Nama Dokter Rujukan"
              {...methods.register("rujukanDokter")} // Tambahkan ini
            />
            <Input
              id="rujukanCatatan"
              label="Catatan"
              placeholder="Masukkan Catatan Rujukan"
              {...methods.register("rujukanCatatan")} // Tambahkan ini
            />
            </div>

            {/* Tombol Submit */}
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Simpan</Button>
              <Link href="/home">
                <Button variant="danger">Batal</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(RekamMedisAddPage, "OPERATOR");


