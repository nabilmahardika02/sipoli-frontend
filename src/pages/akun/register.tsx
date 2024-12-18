import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { jenisKelamin } from "@/content/gender";
import { kewarganegaraan } from "@/content/kewarganegaraan";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { RegisterForm } from "@/types/forms/authForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const RegisterPage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Registrasi Akun");
  }, [setTitle]);

  const router = useRouter();
  const [isPasien, setIsPasien] = useState(true);
  const methods = useForm<RegisterForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "auth/register-account",
        data,
        true
      );

      if (isSuccess) {
        router.push("/akun");
      }
    };

    postData();
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPasien(event.target.value == "PASIEN");
  };

  return (
    <main>
      <section className="mb-5">
        <Typography variant="h4" className="mb-2 md:hidden">
          Registrasi Akun
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectInput
                id="role"
                label="Role"
                placeholder="Role"
                validation={{ required: "Role wajib diisi" }}
                onChange={handleChangeRole}
                helperText="Pilih role terlebih dulu"
              >
                <option value="DOKTER">DOKTER</option>
                <option value="PASIEN">PASIEN</option>
                <option value="PERAWAT">PERAWAT</option>
                <option value="OPERATOR">OPERATOR</option>
              </SelectInput>
              {isPasien && (
                <Input
                  id="nik"
                  validation={{ required: "NIK wajib diisi" }}
                  placeholder="Isi NIK"
                  label="NIK"
                  helperText="NIK akan menjadi default password dan username"
                />
              )}
              {!isPasien && (
                <Input
                  id="username"
                  validation={{ required: "Username wajib diisi" }}
                  placeholder="username"
                  label="Username"
                  helperText="Default password sama dengan username"
                />
              )}
              <Input
                id="name"
                placeholder="Nama"
                validation={{ required: "Nama wajib diisi" }}
                label="Nama"
              />
              {isPasien && (
                <Input
                  id="jabatan"
                  placeholder="Jabatan"
                  validation={{ required: "Jabatan wajib diisi" }}
                  label="Jabatan"
                />
              )}
              {isPasien && (
                <Input
                  id="unitKerja"
                  placeholder="Unit Kerja"
                  validation={{ required: "Unit Kerja wajib diisi" }}
                  label="Unit Kerja"
                />
              )}
              {isPasien && (
                <Input
                  id="eselon"
                  placeholder="Eselon"
                  validation={{ required: "Eselon wajib diisi" }}
                  label="Eselon"
                />
              )}
              <Input
                id="noHp"
                placeholder="081234567890"
                label="No HP"
                validation={{ required: "Nomor HP wajib diisi" }}
              />
              <Input
                id="tanggalLahir"
                type="date"
                placeholder="yyyy-MM-dd"
                validation={{ required: "Tanggal lahir wajib diisi" }}
                label="Tanggal Lahir"
              />
              {isPasien && (
                <TextArea
                  id="alamat"
                  placeholder="Alamat"
                  validation={{ required: "Alamat wajib diisi" }}
                  label="Alamat"
                />
              )}
              {isPasien && (
                <RadioButtonGroup
                  name="kewarganegaraan"
                  options={kewarganegaraan}
                  label="Kewarganegaraan"
                  direction="horizontal"
                  validation={{ required: "Kewarganegaraan wajib diisi" }}
                />
              )}
              <RadioButtonGroup
                name="jenisKelamin"
                options={jenisKelamin}
                label="Jenis Kelamin"
                direction="grid"
                validation={{ required: "Jenis kelamin wajib diisi" }}
              />
            </div>
            <div className="mt-5 flex items-center justify-center gap-4">
              <Button type="submit">Simpan</Button>
              <Link href={"/akun"}>
                <Button variant="danger">Batal</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(RegisterPage, "OPERATOR");
