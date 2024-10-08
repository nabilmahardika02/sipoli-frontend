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
import { Obat } from "@/types/entities/obat";
import { Kunjungan } from "@/types/entities/kunjungan";
import { RekamMedis } from "@/types/entities/rekamMedis";
import Link from "next/link";

const RekamMedisUpdatePage = () => {
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan | null>(null);
  const [rekamMedis, setRekamMedis] = useState<RekamMedis | null>(null);
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [obatSelected, setObatSelected] = useState<{ id: string; kuantitas: number }[]>([]);
  const router = useRouter();
  const { rekamMedisId } = router.query; // rekamMedisId diambil dari query params

  useEffect(() => {
    setTitle("Update Rekam Medis");
  }, [setTitle]);

  useEffect(() => {
    if (router.isReady && rekamMedisId) {
      const fetchRekamMedis = async () => {
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          `rekam-medis/read/${rekamMedisId}`
        );
        if (isSuccess) {
          const rekamMedisData = responseData as RekamMedis;
          setRekamMedis(rekamMedisData);
          setKunjungan(rekamMedisData.kunjungan);
          setObatSelected(
            rekamMedisData.listKuantitasObat.map((item) => ({
              id: item.obat.id,
              kuantitas: item.kuantitas,
            }))
          );
        }
      };
      fetchRekamMedis();
    }
  }, [router.isReady, rekamMedisId]);

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

  const methods = useForm({
    mode: "onTouched",
  });

  const { handleSubmit, watch, setValue } = methods;

  useEffect(() => {
    if (rekamMedis) {
      setValue("beratBadan", rekamMedis.beratBadan);
      setValue("tinggiBadan", rekamMedis.tinggiBadan);
      setValue("tensi", rekamMedis.tensi);
      setValue("diagnosis", rekamMedis.diagnosis);
      setValue("resepObat", rekamMedis.resepObat?.deskripsi || "");
      setValue("tujuanRujukan", rekamMedis.rujukan?.tujuan || "");
      setValue("dokterRujukan", rekamMedis.rujukan?.dokter || "");
      setValue("catatanRujukan", rekamMedis.rujukan?.catatan || "");
    }
  }, [rekamMedis, setValue]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!rekamMedisId) {
      alert("Parameter rekamMedisId is not present!");
      return;
    }

    const payload = {
      ...data,
      kuantitasObat: obatSelected.map((obat) => ({
        obatId: obat.id,
        kuantitas: obat.kuantitas,
      })),
    };

    const [responseData, message, isSuccess] = await sendRequest(
      "put",
      `rekam-medis/update/${rekamMedisId}`,
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
            <Typography variant="h4" weight="bold" className="text-primary-1 mb-5">
              Update Rekam Medis Pasien
            </Typography>

            {/* Informasi Pasien otomatis diisi dari Kunjungan */}
            <Typography variant="h4" weight="bold" className="mt-8">
              Informasi Pasien
            </Typography>
            {kunjungan && (
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <textarea
                    value={`Nama Pasien: ${kunjungan.profile.name}`}
                    style={{
                      width: "100%",
                      resize: "none",
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      fontSize: "22px",
                      padding: "",
                      lineHeight: "",
                    }}
                    readOnly
                  />
                </div>
                <div className="text-right">
                  <textarea
                    value={`Tanggal Kunjungan: ${new Date(
                      kunjungan.tanggal
                    ).toLocaleDateString("id-ID")}`}
                    style={{
                      width: "100%",
                      resize: "none",
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      fontSize: "22px",
                      padding: "",
                      lineHeight: "",
                    }}
                    readOnly
                  />
                </div>
              </div>
            )}

            {/* Tinggi Badan, Berat Badan, Tensi */}
            <div className="grid grid-cols-2 gap-5 mt-1">
              <Input
                id="tinggiBadan"
                label="Tinggi Badan (cm)"
                type="number"
                placeholder="Input Here"
                validation={{ required: "Tinggi badan wajib diisi" }}
              />
              <Input
                id="beratBadan"
                label="Berat Badan (kg)"
                type="number"
                placeholder="Input Here"
                validation={{ required: "Berat badan wajib diisi" }}
              />
              <Input
                id="tensi"
                label="Tensi Darah"
                placeholder="Input Here"
                validation={{ required: "Tensi darah wajib diisi" }}
              />
            </div>

            {/* Keluhan */}
            <Typography variant="h4" weight="bold" className="mt-8">
              Keluhan
            </Typography>
            {kunjungan && (
              <div>
                <textarea
                  value={kunjungan.keluhan}
                  style={{
                    width: "100%",
                    resize: "none",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "22px",
                    padding: "",
                    lineHeight: "1.5",
                  }}
                  readOnly
                />
              </div>
            )}

            {/* Diagnosis */}
            <Typography variant="h4" weight="bold" className="mt-1">
              Diagnosis
            </Typography>
            <TextArea
              id="diagnosis"
              label="Detail Diagnosis"
              placeholder="Input Here"
              validation={{ required: "Diagnosis wajib diisi" }}
            />

            {/* Obat */}
            <Typography variant="h4" weight="bold" className="mt-8">
              Obat
            </Typography>
            <div className="grid grid-cols-2 gap-5 items-center">
              <SelectInput id="obatId" label="Nama Obat" placeholder="Pilih Obat">
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
                        <td className="border border-gray-300 p-2">
                          {selectedObat?.namaObat}
                        </td>
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
            <Typography variant="h4" weight="bold" className="mt-8">
              Resep Obat
            </Typography>
            <TextArea
              id="resepObat"
              label="Detail Resep Obat"
              placeholder="Input Here"
            />

            {/* Rujukan */}
            <Typography variant="h4" weight="bold" className="mt-8">
              Rujukan
            </Typography>
            <div className="grid grid-cols-3 gap-5">
              <Input
                id="tujuanRujukan"
                label="Tujuan Rujukan"
                placeholder="Input Here"
              />
              <Input id="dokterRujukan" label="Dokter" placeholder="Input Here" />
              <Input id="catatanRujukan" label="Catatan" placeholder="Input Here" />
            </div>

            {/* Tombol Submit */}
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Update</Button>
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

export default withAuth(RekamMedisUpdatePage, "user");
