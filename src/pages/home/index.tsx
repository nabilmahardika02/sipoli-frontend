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
import DataTable from "@/lib/datatable";
import { getRowIdKunjungans, kunjunganTableColumns } from "@/types/table/kunjunganColumn";

const HomePage = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);
  const [selectedProfile, setProfile] = useState<Profile>();

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
    const selectedProfileId = event.target.value;

    // Temukan profile berdasarkan profileId yang dipilih
    const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
    setProfile(selectedProfile);

    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all?profileId="+selectedProfileId
      );

      if (isSuccess) {
        setKunjungans(responseData as Kunjungan[]);
      }

      console.log("Data yang diterima:", responseData); 
    };

    if (user?.role === "PASIEN") {
      fetchKunjungan();
    }
  };

  useEffect(() =>{
    // Fungsi untuk mengambil data profil dari API
    const fetchKunjungans = async () => {
        const [responseData, message, isSuccess] = await sendRequest(
            "get",
            "kunjungan/all?isActive=true", 
        );

        if (isSuccess) {
          setKunjungans(responseData as Kunjungan[]);
        }
  
        console.log("Data yang diterima:", responseData); 
      };
  
      if (user?.role !== "PASIEN") {
        fetchKunjungans();
      }
  }, []);

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

      {user?.role !== "PASIEN" && <Typography variant="h6">
        Antrian Hari Ini
      </Typography>}

      <Link href={"/kunjungan/add"}>
        <Button leftIcon={GoPlus}>Daftar Kunjungan</Button>
      </Link>

      <div className="justify-between gap-5 my-5 md:grid-cols-2 gap-5">
        <FormProvider {...methods}>
          {user?.role === "PASIEN" && <SelectInput
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
          </SelectInput>}
        </FormProvider>
      </div>

      {user?.role === "PASIEN" && (
        selectedProfile ? (
          kunjungans.length > 0 ? (
            kunjungans.map((kunjungan) => (
              <div key={kunjungan.id} className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mb-5 border border-gray-200">
                <Typography variant="h6" className="font-semibold mb-2">
                  Antrian {kunjungan.antrian.noAntrian} - Sesi {kunjungan.antrian.sesi}
                </Typography>
                <Typography variant="p1" className="mb-2">
                  {new Date(kunjungan.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
                <div className="flex justify-between">
                  <Link href={"/home"}>
                    <Button variant="danger">Cancel</Button>
                  </Link>
                  <Link href={`/kunjungan/${kunjungan.id}`}>
                    <Button>Detail</Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <Typography variant="p1" className="my-5">
                Tidak ada kunjungan aktif
              </Typography>
            </div>
          )
        ) : (
          <div className="text-center text-gray-500">
            <Typography variant="p1" className="my-5">
              Mohon pilih profil terlebih dahulu
            </Typography>
          </div>
        )
      )}

      <div className="w-full flex items-center justify-end gap-4">
        {user?.role !== "PASIEN" && kunjungans && (
          <DataTable
            columns={kunjunganTableColumns}
            getRowId={getRowIdKunjungans}
            rows={kunjungans}
          />
        )}
      </div>

      <Button className="mt-5" onClick={handleLogout}>
        Logout
      </Button>
    </main>
  );
};

export default withAuth(HomePage, "user");
