import Divider from "@/components/elements/Divider";
import SelectInput from "@/components/elements/forms/SelectInput";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import { useDocumentTitle } from "@/context/Title";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Kunjungan } from "@/types/entities/kunjungan";
import { Profile } from "@/types/entities/profile";
import {
  getRowIdKunjungan,
  kunjunganTables,
} from "@/types/table/hasilPemeriksaanColumn";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";

const RekamMedisPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>();

  const methods = useForm<{ profileId: string }>({
    mode: "onTouched",
  });

  useEffect(() => {
    setTitle("Daftar Rekam Medis");

    const fetchProfiles = async () => {
      const endpoint =
        user?.role === "PASIEN" && user?.profileId
          ? `profile/all-profile?userId=${user.profileId}`
          : "profile/all-profile";

      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        endpoint
      );

      if (isSuccess) {
        setProfiles(responseData as Profile[]);
      }
    };

    fetchProfiles();
  }, [setTitle, user?.role, user?.profileId]);

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<{ profileId: string }> = (data) => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `kunjungan/all?profileId=${data.profileId}&hasRekamMedis=true`
      );

      if (isSuccess) {
        setSelectedProfile(data.profileId);
        setKunjungans(responseData as Kunjungan[]);
      }
    };

    fetchData();
  };

  return (
    <main>
      <section className="mt-5">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="my-5">
            <div className="flex justify-center items-center max-md:flex-wrap gap-y-1 gap-x-2">
              <SelectInput
                id="profileId"
                label="Pilih Profil Pasien"
                {...methods.register("profileId", {
                  required: "Profil harus dipilih",
                })}
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
              <IconButton
                icon={FaSearch}
                type="submit"
                size="lg"
                className="md:place-self-end max-md:mt-4"
              />
            </div>
          </form>
        </FormProvider>
        <Divider />
        <div>
          {!selectedProfile ? (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography
                variant="p1"
                weight="semibold"
                className="text-gray-400"
              >
                Mohon pilih profil pasien untuk melihat rekam medis
              </Typography>
            </div>
          ) : kunjungans && kunjungans.length > 0 ? (
            <DataTable
              columns={kunjunganTables.filter((column) =>
                ["tanggal", "action"].includes(column.field)
              )}
              getRowId={getRowIdKunjungan}
              rows={kunjungans}
              flexColumnIndexes={[0, 1]}
            />
          ) : (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography
                variant="p1"
                weight="semibold"
                className="text-gray-400"
              >
                Tidak ada data rekam medis
              </Typography>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default RekamMedisPage;
