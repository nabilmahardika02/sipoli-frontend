import Button from "@/components/elements/Button";
import SelectInput from "@/components/elements/forms/SelectInput";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { removeToken } from "@/lib/cookies";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Kunjungan } from "@/types/entities/kunjungan";
import { Profile } from "@/types/entities/profile";
import { SandboxForm } from "@/types/forms/SandboxForm";
import {
  getRowIdKunjungans,
  kunjunganTableColumns,
} from "@/types/table/antrianColumn";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import { LuPencil } from "react-icons/lu";


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

  useEffect(() => {
    // Fungsi untuk mengambil data profil dari API
    const fetchProfiles = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "profile/all-profile"
      );

      if (isSuccess) {
        setProfiles(responseData as Profile[]); // Set data profil ke state
      }
    };

    fetchProfiles();
  }, []);

  const handleProfile = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = event.target.value;

    // Temukan profile berdasarkan profileId yang dipilih
    const selectedProfile = profiles.find(
      (profile) => profile.id === selectedProfileId
    );
    setProfile(selectedProfile);

    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all?profileId=" + selectedProfileId + "&isActive=true"
      );

      if (isSuccess) {
        // Sort data berdasarkan status dengan prioritas "Sedang Dilayani" paling atas
        const sortedData = (responseData as Kunjungan[]).sort((a, b) => {
          const statusPriority = (status: number | undefined) => {
            // Tentukan prioritas untuk setiap status
            switch (status) {
              case 1: // Sedang Dilayani
                return 0;
              case 0: // Belum Dilayani
                return 1;
              default: // Jika status tidak valid (undefined)
                return 2;
            }
          };

          return statusPriority(a.status) - statusPriority(b.status);
        });

        setKunjungans(sortedData); // Set data kunjungan yang sudah di-sort
      }
    };

    if (user?.role === "PASIEN") {
      fetchKunjungan();
    }
  };

  useEffect(() => {
    // Fungsi untuk mengambil data profil dari API
    const fetchKunjungans = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all?isActive=true"
      );

      if (isSuccess) {
        setKunjungans(responseData as Kunjungan[]);
      }
    };

    if (user?.role !== "PASIEN") {
      fetchKunjungans();
    }
  }, [user]);

  const logout = useAuthStore.useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    removeToken();
    router.push("/login");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      <Head>
        <title>SIPOLI</title>
      </Head>

      <div className="flex items-center justify-between w-full">
        {user?.role !== "PASIEN" ? (
          <Typography variant="h6">Antrian Hari Ini</Typography>
        ) : (
          <Typography variant="h4" className=" text-primary-1 md:hidden">
            Kunjungan Aktif
          </Typography>
        )}

        {user?.role === "PASIEN" ? (
          <Link href={"/kunjungan/add"}>
            <Button leftIcon={GoPlus}>Daftar Kunjungan</Button>
          </Link>
        ) : (
          <Link href={"/kunjungan/add"}>
            <Button leftIcon={GoPlus}>Tambah Kunjungan</Button>
          </Link>
        )}
      </div>

      <div className="justify-between gap-5 md:grid-cols-2 mt-4">
        <FormProvider {...methods}>
          {user?.role === "PASIEN" && (
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
          )}
        </FormProvider>
      </div>

      {user?.role === "PASIEN" &&
        (selectedProfile ? (
          kunjungans.length > 0 ? (
            <div className="lg:grid gap-4 w-full items-center md:grid grid-cols-2">
              {kunjungans.map((kunjungan) => (
                <div
                  key={kunjungan.id}
                  className="bg-white shadow-lg rounded-lg p-6 mb-5 border border-gray-200"
                >
                  <Typography variant="h6" className="font-semibold mb-2">
                    Antrian {kunjungan.antrian.noAntrian} - Sesi{" "}
                    {kunjungan.antrian.sesi}
                  </Typography>
                  <Typography variant="p1" className="mb-2">
                    {new Date(kunjungan.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
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
        ))}

      <div style={{ width: "100%", overflowX: "auto" }}>
        {user?.role !== "PASIEN" && kunjungans && kunjungans.length > 0 ? (
          <DataTable
            columns={kunjunganTableColumns}
            getRowId={getRowIdKunjungans}
            rows={kunjungans}
            flexColumnIndexes={[2, 4]}
          />
        ) : user?.role !== "PASIEN" ? (
          <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
            <Typography
              variant="p1"
              weight="semibold"
              className="text-gray-400"
            >
              Belum ada Antrian
            </Typography>
          </div>
        ) : (
          <></>
        )}
      </div>

      <Button className="mt-5 place-self-start" onClick={handleLogout}>
        Logout
      </Button>
    </main>
  );
};

export default withAuth(HomePage, "user");
