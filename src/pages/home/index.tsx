import Button from "@/components/elements/Button";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { removeToken } from "@/lib/cookies";
import useAuthStore from "@/store/useAuthStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import Link from "next/link";
import Typography from "@/components/elements/Typography";
import { Profile } from "@/types/entities/profile";
import sendRequest from "@/lib/getApi";
import SelectInput from "@/components/elements/forms/SelectInput";
import { Kunjungan } from "@/types/entities/kunjungan";
import { SandboxForm } from "@/types/forms/SandboxForm";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const HomePage = () => {
  const { setTitle } = useDocumentTitle();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);

  const methods = useForm<SandboxForm>({
    mode: "onTouched",
  });

  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  useEffect(() =>{
    // Fungsi untuk mengambil data profil dari API
    const fetchProfiles = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "profile/all-profile",  
              
      );

      if (isSuccess) {
        setProfiles(responseData as Profile[]); // Set data profil ke state
      }

      console.log("Data yang diterima:", responseData); 
    };

    fetchProfiles();
  }, []);

  const handleProfile = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // const selectedProfileId = event.target.value;

    // const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);

    
  };

  const logout = useAuthStore.useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    removeToken();
    router.push("/login");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center gap-5">
      <Head>
        <title>SIPOLI</title>
      </Head>
      <div className="justify-between gap-5 my-5 md:grid-cols-2 gap-5">
        <FormProvider {...methods}>
          <SelectInput
            id="profileId"
            placeholder="Pilih profil"
            validation={{ required: "Profil wajib diisi" }}
            onChange={handleProfile}
          >
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))
            ) : (
              <option value="">Tidak ada profil yang tersedia</option>
            )}
          </SelectInput>
        </FormProvider>
      </div>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-5 border border-gray-200">
          <Typography variant="h6" className="font-semibold mb-2">Antrian ke berapa</Typography>
          <Typography variant="p1" className="mb-2">Tanggal kunjungan</Typography>
          <Typography variant="p1" className="mb-4">Sesi ke berapa</Typography>
          <div className="flex justify-between">
            <Link href={"/home"}>
              <Button variant="danger">Cancel</Button>
            </Link>
            <Link href={"/home"}>
              <Button>Detail</Button>
            </Link>
          </div>
        </div>

        <Link href={"/kunjungan/add"}>
          <Button leftIcon={GoPlus}>Daftar Kunjungan</Button>
        </Link>

        <Button className="mt-5" onClick={handleLogout}>
          Logout
        </Button>
      
    </main>
  );
};

export default withAuth(HomePage, "user");
