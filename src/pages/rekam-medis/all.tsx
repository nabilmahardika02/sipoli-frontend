import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import SelectInput from "@/components/elements/forms/SelectInput";
import Typography from "@/components/elements/Typography";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { useDocumentTitle } from "@/context/Title";
import useAuthStore from "@/store/useAuthStore";
import { Profile } from "@/types/entities/profile";
import { Kunjungan } from "@/types/entities/kunjungan";
import { FilterKunjunganForm } from "@/types/forms/kunjunganForm";
import { getRowIdKunjungan, kunjunganTables } from "@/types/table/kunjunganColumn";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";

const RekamMedisPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const methods = useForm({
    mode: "onTouched",
  });

  useEffect(() => {
    setTitle("Daftar Rekam Medis");

    const fetchProfiles = async () => {
      if (user?.role === "PASIEN") {
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          `profile/all-profile?userId=${user.id}`
        );

        if (isSuccess) {
          setProfiles(responseData as Profile[]);
        } else {
          console.error("Failed to fetch profiles:", message);
        }
      } else {
        const [responseData, message, isSuccess] = await sendRequest(
          "get",
          "profile/all-profile"
        );

        if (isSuccess) {
          setProfiles(responseData as Profile[]);
        } else {
          console.error("Failed to fetch profiles:", message);
        }
      }
    };

    fetchProfiles();
  }, [setTitle, user?.role, user?.id]);

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = (data) => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `kunjungan/all?profileId=${data.profileId}&startDate=${data.startDate}&endDate=${data.endDate}&hasRekamMedis=true`
      );

      if (isSuccess) {
        setSelectedProfile(data.profileId);
        setStartDate(data.startDate as string);
        setEndDate(data.endDate as string);
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
              <SelectInput id="profileId" label="Pilih Pasien" {...methods.register("profileId")}>
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
              <Input id="startDate" label="Tanggal Awal" type="date" {...methods.register("startDate")} />
              <Typography variant="p2" className="mt-2 md:mt-6">
                -
              </Typography>
              <Input id="endDate" label="Tanggal Akhir" type="date" {...methods.register("endDate")} />
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
          {!selectedProfile || !startDate || !endDate ? (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography variant="p1" weight="semibold" className="text-gray-400">
                Mohon pilih profil pasien dan rentang tanggal untuk melihat rekam medis
              </Typography>
            </div>
          ) : kunjungans && kunjungans.length > 0 ? (
            <DataTable
              columns={kunjunganTables.filter(column => ["tanggal", "action"].includes(column.field))} // Tampilkan hanya kolom tanggal dan detail
              getRowId={getRowIdKunjungan}
              rows={kunjungans}
              flexColumnIndexes={[0, 1]}
            />
          ) : (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography variant="p1" weight="semibold" className="text-gray-400">
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
