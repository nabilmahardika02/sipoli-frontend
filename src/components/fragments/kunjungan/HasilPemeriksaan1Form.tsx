import Breadcrumb from "@/components/elements/Breadcrumb";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
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

  const getDefaultTanggalPeriksa = () => {
    const currentDate = new Date();
    const kunjunganDate = new Date(kunjungan.tanggal);

    kunjunganDate.setHours(currentDate.getHours());
    kunjunganDate.setMinutes(currentDate.getMinutes());

    const year = kunjunganDate.getFullYear();
    const month = String(kunjunganDate.getMonth() + 1).padStart(2, "0"); 
    const day = String(kunjunganDate.getDate()).padStart(2, "0");
    const hours = String(kunjunganDate.getHours()).padStart(2, "0");
    const minutes = String(kunjunganDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (hasilPemeriksaan) {
      methods.setValue("dokter", hasilPemeriksaan.dokter);
      methods.setValue("keluhanUtama", hasilPemeriksaan.keluhanUtama);
      methods.setValue(
        "riwayatPenyakitSekarang",
        hasilPemeriksaan.riwayatPenyakitSekarang
      );
      methods.setValue(
        "tanggalPeriksa",
        hasilPemeriksaan.tanggalPeriksa || getDefaultTanggalPeriksa()
      );
    }
  }, [hasilPemeriksaan, methods, kunjungan.tanggal]);

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
      tanggalPeriksa: data.tanggalPeriksa,
    }));

    setSection(2);
  };

  return (
    <section>
      <Breadcrumb currentStep={1} totalSteps={6} />
      <Divider weight="thin" className="my-5" />
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
                defaultValue={getDefaultTanggalPeriksa()} 
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
