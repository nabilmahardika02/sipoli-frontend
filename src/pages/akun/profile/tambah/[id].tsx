import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { jenisKelamin } from "@/content/gender";
import { kewarganegaraan } from "@/content/kewarganegaraan";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { AddProfileForm } from "@/types/forms/profileForm";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const TambahProfilePage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Tambah Profil");
  }, [setTitle]);

  const router = useRouter();

  const methods = useForm<AddProfileForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<AddProfileForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "profile/add",
        {
          ...data,
          idAccount: router.query.id,
        },
        true
      );

      if (isSuccess) {
        router.push("/akun/detail/" + router.query.id);
      }
    };

    postData();
  };

  return (
    <main>
      <Head>
        <title>Tambah Profil</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden">
        Tambah Profil
      </Typography>
      <section className="mb-5">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="nik"
                placeholder="Isi NIK"
                label="NIK"
                validation={{ required: "NIK wajib diisi" }}
              />
              <Input
                id="name"
                placeholder="Nama"
                label="Nama"
                validation={{ required: "Nama wajib diisi" }}
              />
              <SelectInput
                id="relative"
                label="Hubungan"
                placeholder="Pilih status"
                validation={{ required: "Relative status wajib diisi" }}
              >
                <option value="1">Pasangan</option>
                <option value="2">Anak</option>
              </SelectInput>
              <Input
                id="tanggalLahir"
                type="date"
                label="Tanggal Lahir"
                validation={{ required: "Tanggal lahir wajib diisi" }}
              />
              <Input id="noHp" placeholder="08293819xxxx" label="Nomor HP" />
              <RadioButtonGroup
                name="jenisKelamin"
                options={jenisKelamin}
                label="Jenis Kelamin"
                direction="grid"
                validation={{ required: "Jenis kelamin wajib diisi" }}
              />
              <RadioButtonGroup
                name="kewarganegaraan"
                options={kewarganegaraan}
                label="Kewarganegaraan"
                direction="horizontal"
                validation={{ required: "Kewarganegaraan wajib diisi" }}
              />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Tambah</Button>
              <Link href={`/akun/detail/${router.query.id}`}>
                <Button variant="danger">Batal</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(TambahProfilePage, "OPERATOR");
