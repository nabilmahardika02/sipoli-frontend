import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { UpdateForm } from "@/types/forms/authForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Account } from "@/types/entities/account";
import { Profile } from "@/types/entities/profile";

const jenisKelamin = [
  {
    value: "false",
    text: "Laki-laki",
  },
  {
    value: "true",
    text: "Perempuan",
  },
];

const UpdatePage = () => {
  const { setTitle } = useDocumentTitle();
  const [selectedAccount, setAccount] = useState<Account>();
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    setTitle("Update Akun");
  }, [setTitle]);

  const router = useRouter();
  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `auth/get-account-by-id?id=${router.query.id}`
      );

      if (isSuccess) {
        setAccount(responseData as Account);
      }
    };
    fetchAccount();
  }, [router.query.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "profile/main-profile?userID=" + router.query.id
      );

      if (isSuccess) {
        setProfile(responseData as Profile);
      }
    }
    fetchProfile();
  }, [router.query.id])

  const [isPasien, setIsPasien] = useState(true);
  const methods = useForm<UpdateForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;
  
  const onSubmit: SubmitHandler<UpdateForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "auth/update-pasien-account",
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
                value={selectedAccount?.role}
              >
                <option value="DOKTER">DOKTER</option>
                <option value="PASIEN">PASIEN</option>
                <option value="PERAWAT">PERAWAT</option>
                <option value="OPERATOR">OPERATOR</option>
              </SelectInput>
              <Input
                id="id"
                placeholder="User ID"
                label="User ID"
                value={selectedAccount?.id}
              />
              <Input
                  id="username"
                  placeholder="username"
                  label="Username"
                  helperText="Default password sama dengan username"
                  value={selectedAccount?.username}
                />
              {isPasien && (
                <Input
                  id="nip"
                  validation={{ required: "NIP wajib diisi" }}
                  placeholder="1234567890"
                  label="NIP"
                  helperText="NIP akan menjadi default password dan username"
                  value={selectedAccount?.nip}
                />
              )}
              <Input
                id="name"
                placeholder="Nama"
                validation={{ required: "Nama wajib diisi" }}
                label="Nama"
                value={profile?.name}
              />
              {isPasien && (
                <Input
                  id="jabatan"
                  placeholder="Jabatan"
                  validation={{ required: "Jabatan wajib diisi" }}
                  label="Jabatan"
                  value={selectedAccount?.jabatan}
                />
              )}
              {isPasien && (
                <Input
                  id="unitKerja"
                  placeholder="Unit Kerja"
                  validation={{ required: "Unit Kerja wajib diisi" }}
                  label="Unit Kerja"
                  value={selectedAccount?.unitKerja}
                />
              )}
              {isPasien && (
                <Input
                  id="eselon"
                  placeholder="Eselon"
                  validation={{ required: "Eselon wajib diisi" }}
                  label="Eselon"
                  value={selectedAccount?.eselon.toString()}
                />
              )}
              <Input 
                id="noHp" 
                placeholder="081234567890" 
                label="No HP" 
                value={profile?.noHp}/>
              <Input
                id="tanggalLahir"
                type="date"
                placeholder="yyyy-MM-dd"
                label="Tanggal Lahir"
                value={profile?.tanggalLahir}
              />
              <RadioButtonGroup
                name="jenisKelamin"
                options={jenisKelamin}
                label="Jenis Kelamin"
                direction="grid"
                validation={{ required: "Jenis kelamin wajib diisi" }}
                value={profile?.jenisKelamin.toString()}
              />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Submit</Button>
              <Link href={`/akun/detail/${router.query.id}`}>
                <Button variant="danger">Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(UpdatePage, "OPERATOR");
