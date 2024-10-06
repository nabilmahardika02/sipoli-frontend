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
import { getRowIdKunjungans, kunjunganTableColumns } from "@/types/table/antrianColumn";
import Divider from "@/components/elements/Divider";

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
        "kunjungan/all?profileId="+selectedProfileId+"&isActive=true",
      );

      if (isSuccess) {
        // Sort data berdasarkan status dengan prioritas "Sedang Dilayani" paling atas
        const sortedData = (responseData as Kunjungan[]).sort((a, b) => {
          const statusPriority = (status: number) => {
            // Tentukan prioritas untuk setiap status
            switch (status) {
              case 1: // Sedang Dilayani
                return 0;
              case 0: // Belum Dilayani
                return 1;
            }
          };
  
          return statusPriority(a.status) - statusPriority(b.status);
        });
  
        setKunjungans(sortedData); // Set data kunjungan yang sudah di-sort
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

      {user?.role === "PASIEN" && <Typography variant="h4" className=" text-primary-1 md:hidden">
        Kunjungan Aktif
      </Typography>}

      <Divider className="md:hidden"/>

      {user?.role === "PASIEN" && <Link href={"/kunjungan/add"}>
        <Button leftIcon={GoPlus}>Daftar Kunjungan</Button>
      </Link>}

      {user?.role !== "PASIEN" && <Link href={"/kunjungan/add"}>
        <Button leftIcon={GoPlus}>Tambah Kunjungan</Button>
      </Link>}

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
            <div className="lg:grid grid-cols-3 gap-4 w-full items-center md:grid grid-cols-2">
              {kunjungans.map((kunjungan) => (
                <div key={kunjungan.id} className="bg-white shadow-lg rounded-lg p-6 mb-5 border border-gray-200">
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
              ))}
            </div>
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

      <div style={{ width: '100%', overflowX: 'auto' }}>
        {user?.role !== "PASIEN" && kunjungans && kunjungans.length > 0 ? (
          <DataTable
            columns={kunjunganTableColumns}
            getRowId={getRowIdKunjungans}
            rows={kunjungans}
            sortingOrder={['asc', 'desc']}  // Mengatur urutan sort (ascending, descending)
            initialState={{
              sorting: {
                sortModel: [
                  {
                    field: 'status',  // Pastikan ini sesuai dengan field di columns
                    sort: 'desc',  // Untuk memprioritaskan "Sedang Dilayani" di atas
                  },
                ],
              },
            }}
            autoHeight
            disableSelectionOnClick
          />
        ) : user?.role !== "PASIEN" ? (
          <Typography variant="h6" className="text-gray-500">Belum ada antrian</Typography>
        ): ""}
      </div>

      <Button className="mt-5" onClick={handleLogout}>
        Logout
      </Button>
    </main>
  );
};

export default withAuth(HomePage, "user");
