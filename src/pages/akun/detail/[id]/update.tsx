import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import { LoadingDiv } from "@/components/elements/Loading";
import withAuth from "@/components/hoc/withAuth";
import { jenisKelamin } from "@/content/gender";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { Profile } from "@/types/entities/profile";
import { UpdateAkunForm } from "@/types/forms/authForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const UpdatePage = () => {
  const { setTitle } = useDocumentTitle();
  const [selectedAccount, setAccount] = useState<Account>();
  const [profile, setProfile] = useState<Profile>();
  const [isPasien, setIsPasien] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTitle("Ubah Akun");
  }, [setTitle]);

  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `auth/detail/${router.query.id}`
      );

      if (isSuccess) {
        var data = responseData as Account;
        setAccount(data);
        setProfile(data.listProfile[0]);
      }
    };
    fetchAccount();
  }, [router.query.id]);

  useEffect(() => {
    if (selectedAccount?.role) {
      setIsPasien(selectedAccount.role === "PASIEN");
    }
  }, [selectedAccount]);

  const methods = useForm<UpdateAkunForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateAkunForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "auth/update",
        { ...data, id: router.query.id },
        true
      );

      if (isSuccess) {
        router.push("/akun/detail/" + router.query.id);
      }
    };
    postData();
  };

  useEffect(() => {
    if (selectedAccount && profile) {
      methods.setValue("username", selectedAccount.username);
      methods.setValue("eselon", selectedAccount.eselon);
      methods.setValue("jabatan", selectedAccount.jabatan);
      methods.setValue("unitKerja", selectedAccount.unitKerja);
      methods.setValue("name", profile.name);
      methods.setValue("noHp", profile.noHp);
      methods.setValue("tanggalLahir", profile.tanggalLahir);
      methods.setValue("alamat", selectedAccount.alamat);
      //@ts-ignore
      methods.setValue("jenisKelamin", profile.jenisKelamin ? "true" : "false");
    }
  }, [selectedAccount, profile, methods]);

  return (
    <main>
      <section className="mb-5">
        {selectedAccount && profile ? (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="username"
                  placeholder="username"
                  label="Username"
                  validation={{ required: "Username wajib diisi" }}
                />
                {isPasien ? (
                  <>
                    <Input
                      id="jabatan"
                      placeholder="Jabatan"
                      validation={{ required: "Jabatan wajib diisi" }}
                      label="Jabatan"
                    />
                    <Input
                      id="unitKerja"
                      placeholder="Unit Kerja"
                      validation={{ required: "Unit Kerja wajib diisi" }}
                      label="Unit Kerja"
                    />
                    <Input
                      id="eselon"
                      placeholder="Eselon"
                      validation={{ required: "Eselon wajib diisi" }}
                      label="Eselon"
                    />
                    <Input
                      id="alamat"
                      placeholder="Alamat"
                      validation={{ required: "Alamat wajib diisi" }}
                      label="Alamat"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      id="noHp"
                      label="Nomor HP"
                      placeholder="Masukkan nomor HP"
                      validation={{ required: "Nomor HP wajib diisi" }}
                    />
                    <Input
                      id="tanggalLahir"
                      type="date"
                      placeholder="yyyy-MM-dd"
                      validation={{ required: "Tanggal lahir wajib diisi" }}
                      label="Tanggal Lahir"
                    />
                    <RadioButtonGroup
                      name="jenisKelamin"
                      options={jenisKelamin}
                      label="Jenis Kelamin"
                      direction="grid"
                      validation={{ required: "Jenis kelamin wajib diisi" }}
                    />
                  </>
                )}
              </div>
              <div className="mt-5 flex items-center justify-center gap-4">
                <Button type="submit">Simpan</Button>
                <Link href={`/akun/detail/${router.query.id}`}>
                  <Button variant="danger">Batal</Button>
                </Link>
              </div>
            </form>
          </FormProvider>
        ) : (
          <LoadingDiv />
        )}
      </section>
    </main>
  );
};

export default withAuth(UpdatePage, "OPERATOR");
