import withAuth from "@/components/hoc/withAuth";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import { useDocumentTitle } from "@/context/Title";
import { jenisKelamin } from "@/content/gender";
import { Profile } from "@/types/entities/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { UpdateProfileForm } from "@/types/forms/profileForm";
import sendRequest from "@/lib/getApi";
import Head from "next/head";
import Link from "next/link";
import Typography from "@/components/elements/Typography";

const UpdateProfilePage = () => {
  const { setTitle } = useDocumentTitle();
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    setTitle("Ubah Profil");
  }, [setTitle]);

  const router = useRouter();

  const methods = useForm<UpdateProfileForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    const fetchProfile = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `profile/detail/${router.query.id}`,
      );

      if (isSuccess) {
        setProfile(responseData as Profile);
      }
      console.log(responseData);
    }
    fetchProfile();
  }, [router.query.id])

  const onSubmit: SubmitHandler<UpdateProfileForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "profile/update",
        {
          ...data,
          id: router.query.id,
        },
        true
      );
      if (isSuccess) {
        router.push("/akun/detail/" + profile?.accountId);
      }
    };
    postData();
  }

  return (
    <main>
      <Head>
        <title>Ubah Profil</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden">
        Ubah Profil
      </Typography>
      <section className="mb-5">
      {profile && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="name"
                placeholder="Nama"
                label="Nama"
                validation={{ required: "Nama wajib diisi" }}
                defaultValue={profile.name}
              />
              <SelectInput
                id="relative"
                label="Hubungan"
                placeholder="Pilih status"
                validation={{ required: "Relative status wajib diisi" }}
                defaultValue={profile.relative}
              >
                <option value="1">Pasangan</option>
                <option value="2">Anak</option>
              </SelectInput>
              <Input
                id="tanggalLahir"
                type="date"
                label="Tanggal Lahir"
                validation={{ required: "Tanggal lahir wajib diisi" }}
                defaultValue={profile.tanggalLahir}
              />
              <Input id="noHp" placeholder="08293819xxxx" label="Nomor HP" defaultValue={profile.noHp}/>
              <RadioButtonGroup
                name="jenisKelamin"
                options={jenisKelamin}
                label="Jenis Kelamin"
                direction="grid"
                validation={{ required: "Jenis kelamin wajib diisi" }}
                defaultValue={profile?.jenisKelamin !== null 
                  && profile?.jenisKelamin !== undefined
                  ? profile?.jenisKelamin.toString()
                  : ""}
              />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Submit</Button>
              <Link href={`/akun/detail/${profile.accountId}`}>
                <Button variant="danger">Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      )
      
      }
      </section>
    </main>
  );
};

export default withAuth(UpdateProfilePage, "OPERATOR");
