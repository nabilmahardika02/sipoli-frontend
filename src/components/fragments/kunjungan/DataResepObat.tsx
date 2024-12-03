import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import TextArea from "@/components/elements/forms/TextArea";
import IconButton from "@/components/elements/IconButton";
import ModalLayout from "@/components/layouts/ModalLayout";
import Typography from "@/components/elements/Typography";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { HasilPemeriksaan } from "@/types/entities/kunjungan";
import { KuantitasObat } from "@/types/entities/kuantitasObat";
import { formatDateOnly, getSatuanObat } from "@/lib/formater";
import { ResepObatRujukanForm, KuantitasObatRequest } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

const DataResepObat = ({
  listKuantitasObat,
  resepObatRujukan,
  data,
  idPemeriksaan,
  trigger,
  setTrigger,
}: {
  listKuantitasObat: KuantitasObat[];
  resepObatRujukan?: ResepObatRujukanForm;
  data: HasilPemeriksaan;
  idPemeriksaan: string;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useAuthStore.useUser();
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<{
    kie: string;
    resepObatRujukan: ResepObatRujukanForm;
    listKuantitasObat: KuantitasObatRequest[];
  }>({
    mode: "onTouched",
  });

  const { handleSubmit, control, reset } = methods;
  const { fields } = useFieldArray({
    control,
    name: "listKuantitasObat",
  });

  const prepareDefaultValues = () => ({
    kie: data.kie,
    resepObatRujukan: resepObatRujukan || { deskripsi: "" },
    listKuantitasObat: listKuantitasObat.map((obat) => {
      const closestExpiryDate =
        obat.obat.listRestockObat?.length > 0
          ? obat.obat.listRestockObat
              .map((restock) => restock.tanggalKadaluarsa)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
          : "Tidak tersedia";

      return {
        obatId: obat.obat.id,
        namaObat: obat.obat.namaObat,
        kuantitas: obat.kuantitas,
        petunjukPemakaian: obat.petunjukPemakaian,
        tanggalKadaluarsa: formatDateOnly(closestExpiryDate),
        jenisSatuan: getSatuanObat(obat.obat.jenisSatuan), // Tambahkan sementara
      };
    }),
  });

  const handleOpenModal = () => {
    reset(prepareDefaultValues());
    setShowModal(true);
  };

  const onSubmit: SubmitHandler<{
    kie: string;
    resepObatRujukan: ResepObatRujukanForm;
    listKuantitasObat: KuantitasObatRequest[];
  }> = async (formData) => {
    const [response, message, isSuccess] = await sendRequest(
      "put",
      `hasil-pemeriksaan/${idPemeriksaan}/update-obat-dan-kie`,
      formData,
      true
    );

    if (isSuccess) {
      setShowModal(false);
      setTrigger(!trigger);
    }
  };

  return (
    <div>
      <Divider weight="thin" className="my-5" />
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">Resep Obat</Typography>
        {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
          <IconButton icon={LuPencil} variant="primary" onClick={handleOpenModal} />
        )}
      </div>

      {/* Display Data */}
      {listKuantitasObat.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {listKuantitasObat.map((obat, index) => {
            const closestExpiryDate =
              obat.obat.listRestockObat?.length > 0
                ? obat.obat.listRestockObat
                    .map((restock) => restock.tanggalKadaluarsa)
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
                : null;

            const jenisSatuan = getSatuanObat(obat.obat.jenisSatuan);

            return (
              <div key={index} className="border p-3 rounded-lg mb-2">
                <Typography variant="p2" weight="semibold" className="text-gray-700">
                  Obat
                </Typography>
                <Typography className="text-primary-1">{obat.obat.namaObat || "-"}</Typography>

                <Typography variant="p2" weight="semibold" className="text-gray-700 mt-2">
                  Kuantitas
                </Typography>
                <Typography className="text-primary-1">
                  {obat.kuantitas} {jenisSatuan}
                </Typography>

                <Typography variant="p2" weight="semibold" className="text-gray-700 mt-2">
                  Tanggal Kadaluarsa
                </Typography>
                <Typography className="text-primary-1">
                  {closestExpiryDate ? formatDateOnly(closestExpiryDate) : "Tidak tersedia"}
                </Typography>

                <Typography variant="p2" weight="semibold" className="text-gray-700 mt-2">
                  Petunjuk Pemakaian
                </Typography>
                <Typography className="text-primary-1">{obat.petunjukPemakaian || "-"}</Typography>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-700 font-medium">
            Pasien tidak diberikan obat dari klinik
          </Typography>
        </div>
      )}

      <div className="mt-3">
        <Typography variant="p2" weight="semibold" className="text-gray-700">
          Resep Obat di Luar Klinik
        </Typography>
        <Typography className="text-primary-1">{resepObatRujukan?.deskripsi || "-"}</Typography>
      </div>

      <div className="mt-3">
        <Typography variant="p2" weight="semibold" className="text-gray-700">
          Komunikasi Informasi dan Edukasi
        </Typography>
        <Typography className="text-primary-1">{data.kie || "-"}</Typography>
      </div>

      {/* Modal for Editing */}
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%] max-h-[80vh] overflow-y-auto">
            <Typography variant="h6" className="text-primary-1">
              Ubah Resep Obat dan KIE
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border p-4 grid grid-cols-1 gap-5 rounded-md"
                    >
                      <Input
                        id={`listKuantitasObat.${index}.namaObat`}
                        label="Obat"
                        placeholder="Obat"
                        value={field.namaObat}
                        readOnly
                      />
                      <div className="grid grid-cols-2 gap-5">
                        <Input
                          id={`listKuantitasObat.${index}.tanggalKadaluarsa`}
                          placeholder="Tanggal Kadaluarsa"
                          label="Tanggal Kadaluarsa"
                          value={field.tanggalKadaluarsa || ""}
                          readOnly
                        />
<Input
  id={`listKuantitasObat.${index}.jenisSatuan`}
  placeholder="Jenis Satuan"
  label="Jenis Satuan"
  value={
    listKuantitasObat[index]?.obat?.jenisSatuan
      ? getSatuanObat(listKuantitasObat[index]?.obat?.jenisSatuan)
      : ""
  }
  readOnly
/>
</div>
                      <Input
                        id={`listKuantitasObat.${index}.kuantitas`}
                        label="Kuantitas"
                        placeholder="Kuantitas"
                        type="number"
                      />
                      <Input
                        id={`listKuantitasObat.${index}.petunjukPemakaian`}
                        label="Petunjuk Pemakaian"
                        placeholder="Petunjuk Pemakaian"
                      />
                    </div>
                  ))}
                </div>
                <TextArea
                  id="resepObatRujukan.deskripsi"
                  placeholder="Resep Obat di Luar Klinik"
                  label="Resep Obat di Luar Klinik"
                  className="mb-3"
                />
                <TextArea
                  id="kie"
                  placeholder="Komunikasi Informasi dan Edukasi"
                  label="Komunikasi Informasi dan Edukasi"
                />
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="danger" onClick={() => setShowModal(false)}>
                    Batal
                  </Button>
                  <Button type="submit">Simpan</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default DataResepObat;



// hapus obat dan tambah obat di komen. hapus obat bisa, tp tambah obat belum, harusnya refer ke form5resepobat.





