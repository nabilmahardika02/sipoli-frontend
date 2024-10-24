import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
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

  const [dokters, setDokters] = useState<Account[]>();
  const methods = useForm<HasilKunjunganForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if (hasilPemeriksaan) {
      methods.setValue("dokterPengirim", hasilPemeriksaan.dokterPengirim);
      methods.setValue("dokter", hasilPemeriksaan.dokter);
      methods.setValue("keluhanUtama", hasilPemeriksaan.keluhanUtama);
      methods.setValue(
        "riwayatPenyakitSekarang",
        hasilPemeriksaan.riwayatPenyakitSekarang
      );
      methods.setValue("kie", hasilPemeriksaan.kie);
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
      dokterPengirim: data.dokterPengirim,
      dokter: data.dokter,
      keluhanUtama: data.keluhanUtama,
      riwayatPenyakitSekarang: data.riwayatPenyakitSekarang,
      kie: data.kie,
    }));

    setSection(2);
  };

  return (
    <section>
      <Typography variant="h7" className="text-primary-1">
        Data Kunjungan - {kunjungan.profile.name}
      </Typography>
      {dokters ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <Input
                id="dokterPengirim"
                placeholder="Dokter Pengirim"
                label="Dokter Pengirim"
              />
              <SelectInput
                id="dokter"
                placeholder="Pilih Dokter"
                validation={{ required: "Mohon pilih dokter yang menangani" }}
                label="Dokter"
              >
                {dokters?.map((dokter) => (
                  <option key={dokter.id} value={dokter.id}>
                    {dokter.listProfile[0].name}
                  </option>
                ))}
              </SelectInput>
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
              <Input id="kie" placeholder="KIE" label="KIE" />
            </div>
            <div className="flex items-center gap-3">
              <Link href={"/kunjungan/" + router.query.id}>
                <Button className="max-md:w-full" variant="danger">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="max-md:w-full">
                Next
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
