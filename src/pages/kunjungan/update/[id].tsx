import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import router from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Profile } from "@/types/entities/profile";
import { Account } from "@/types/entities/account";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { KunjunganForm } from "@/types/forms/kunjunganForm";
import Divider from "@/components/elements/Divider";

const sesi = [
  { value: "1", text: "Sesi 1 (08:00 - 10:00 WITA)" },
  { value: "2", text: "Sesi 2 (10:00 - 12:00 WITA)" },
  { value: "3", text: "Sesi 3 (13:00 - 15:00 WITA)" },
  { value: "4", text: "Sesi 4 (15:00 - 16:30 WITA)" },
];

const KunjunganUpdatePage = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [status, setStatus] = useState();

  const isBelumDilayani = status === 0;

  const methods = useForm({
      mode: "onTouched",
      defaultValues: {
      }
    });

  useEffect(() => {
    setTitle("Update Kunjungan");
  }, [setTitle]);


  useEffect(() => {
    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/id?idKunjungan=" + router.query.id
      );

      if (isSuccess) {
          const transformedData = {
            sesi: 1,
            accountId: responseData.id,
            profileId: responseData.profile.id,
            tanggalKunjungan: responseData.tanggal.slice(0, 10),
            status: 0,
            keluhan: responseData.keluhan
          };
          setKunjungan(responseData as Kunjungan);
          methods.reset(transformedData);
      } else {
        console.log(message);
      }
    };

    fetchKunjungan();
  }, [router.query.id]);

//   const methods = useForm<KunjunganForm>({
//     mode: "onTouched",
// //     defaultValues: kunjungan, // Isi form dengan data kunjungan saat ini
//
//   });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<KunjunganForm> = (data) => {
    if (!isBelumDilayani) return;

    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `kunjungan/update`,
        data,
        true
      );

      if (isSuccess) {
        router.push("/home");
      }
    };

    postData();
  };

  return (
    <main>
      <section>
        <div className="flex justify-center md:hidden">
          <Typography variant="h4" className="text-primary-1">
            Update Kunjungan
          </Typography>
        </div>
        <Divider className="md:hidden" />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="justify-between gap-5 my-5 md:grid-cols-2">
              <RadioButtonGroup
                name="sesi"
                options={sesi}
                label="Sesi"
                direction="horizontal"
                validation={{ required: "Mohon pilih sesi" }}
                disabled={!isBelumDilayani || user?.role !== "PASIEN"}
              />
              <Divider />
              <Typography variant="p1" weight="bold" className="text-primary-1 my-5">
                Data Pribadi
              </Typography>
              <div className="justify-between gap-5 my-5">
                <Typography variant="p1" className="mt-2">
                  Nama: {profile?.name}
                </Typography>
                <Typography variant="p1">No. HP: {profile?.noHp}</Typography>
                <Typography variant="p1">
                  Tanggal Lahir: {profile?.tanggalLahir ? formatDate(profile.tanggalLahir) : "-"}
                </Typography>
                <Typography variant="p1">
                  Jenis Kelamin: {profile?.jenisKelamin !== undefined ? formatGender(profile.jenisKelamin) : "-"}
                </Typography>
              </div>
              <Divider />
              <Input
                id="tanggalKunjungan"
                label="Tanggal Kunjungan"
                type="date"
                disabled={!isBelumDilayani}
              />
              <TextArea
                id="keluhan"
                label="Keluhan"
                placeholder="Keluhan yang dirasakan"
                maxLength={255}
                validation={{ required: "Mohon beri tahu keluhan Anda" }}
                disabled={!isBelumDilayani}
              />
            </div>
            <div className="mt-5 flex items-center justify-center gap-4">
              <Button type="submit" disabled={!isBelumDilayani}>
                Update
              </Button>
              <Link href={"/home"}>
                <Button variant="danger">Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(KunjunganUpdatePage, "user");
