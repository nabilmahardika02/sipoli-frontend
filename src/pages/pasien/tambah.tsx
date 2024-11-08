import withAuth from "@/components/hoc/withAuth";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import SearcableSelect from "@/components/elements/forms/SearchableSelect";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import { useDocumentTitle } from "@/context/Title";
import { jenisKelamin } from "@/content/gender";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { AddProfileForm } from "@/types/forms/profileForm";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const TambahPasienPage = () => {
  const { setTitle } = useDocumentTitle();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<String>();
  const router = useRouter();

  useEffect(() => {
    setTitle("Tambah Profil");
  }, [setTitle]);

  const methods = useForm<AddProfileForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    const fetchAccounts = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/users?role=PASIEN"
      );

      if (isSuccess) {
        setAccounts(responseData as Account[]);
      }
    };
    fetchAccounts();
  }, []);

  const onSubmit: SubmitHandler<AddProfileForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "profile/add",
        data,
        true
      );

      if (isSuccess) {
        router.push("/pasien");
      }
    };

    postData();
  };

  const handleChangeAccount = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountId(event.target.value);
  };

  return (
    <main>
      <Head>
        <title>Tambah Pasien</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden">
        Tambah Pasien
      </Typography>
      <section>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="justify-between gap-5 my-5 grid grid-cols-1">
              <SelectInput
                id="idAccount"
                label="Akun"
                placeholder="Pilih akun"
                validation={{ required: "Akun wajib diisi" }}
                onChange={handleChangeAccount}
                helperText="Pilih akun terlebih dahulu"
              >
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {
                        account.listProfile.find(
                          (profile) => profile.relative === 0
                        )?.nik
                      }{" "}
                      -{" "}
                      {account.listProfile.find(
                        (profile) => profile.relative === 0
                      )?.name ?? account.username}
                    </option>
                  ))
                ) : (
                  <option value="">Tidak ada akun yang tersedia</option>
                )}
              </SelectInput>
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
                label="Relative"
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
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Tambah</Button>
              <Link href={`/pasien`}>
                <Button variant="danger">Kembali</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(TambahPasienPage, "PERAWAT");
