import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Profile } from "@/types/entities/profile";
import { Account } from "@/types/entities/account";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { KunjunganForm } from "@/types/forms/kunjunganForm";
import Divider from "@/components/elements/Divider";

const sesi = [
    {
        value: "1",
        text: "Sesi 1 (08:00 - 10:00 WITA)",
    },
    {
        value: "2",
        text: "Sesi 2 (10:00 - 12:00 WITA)",
    },
    {
        value: "3",
        text: "Sesi 3 (13:00 - 15:00 WITA)",
    },
    {
        value: "4",
        text: "Sesi 4 (15:00 - 16:30 WITA)",
    },
];

const KunjunganUpdatePage = () => {
    const user = useAuthStore.useUser();
    const { setTitle } = useDocumentTitle();
    const router = useRouter();
    const { id } = router.query; // Get the kunjungan id from the URL
    const [kunjungan, setKunjungan] = useState<KunjunganForm | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [profile, setProfile] = useState<Profile>();
    const [account, setAccount] = useState<Account>();
      const [status, setStatus] = useState<string>();

    useEffect(() => {
        setTitle("Perbarui Kunjungan");
    }, [setTitle]);

    useEffect(() => {
        const fetchKunjungan = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "get",
                `kunjungan/id?id=${id}`,  // Use a query parameter if necessary
            );

            if (isSuccess) {
                setKunjungan(responseData as KunjunganForm);
                setProfiles(responseData.listProfile || []);
                setProfile(responseData.profile || null);

                // Set default account based on profile
                const fetchedAccount = accounts.find((account) =>
                    account.listProfile.some((p) => p.id === responseData.profile.id)
                );
                setAccount(fetchedAccount);

                // Pre-fill the form with the fetched data
                reset({
                    sesi: responseData.antrian.sesi.toString(),
                    profileId: responseData.profile.id,
                    accountId: fetchedAccount?.id || "",
                    tanggalKunjungan: responseData.tanggal.split("T")[0],
                    status: responseData.status,
                    keluhan: responseData.keluhan,
                });
            }
        };

        if (id) {
            fetchKunjungan();  // Fetch existing kunjungan data
        }
    }, [id, accounts]);

    useEffect(() => {
        // Fetch accounts as in the add page
        const fetchAccounts = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "get",
                "auth/users?role=PASIEN",
            );

            if (isSuccess) {
                setAccounts(responseData as Account[]);
            }
        };

        fetchAccounts();
    }, []);

    const methods = useForm<KunjunganForm>({
        defaultValues: kunjungan || {},
        mode: "onTouched",
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (kunjungan) {
            reset(kunjungan); // Set the form values once kunjungan data is loaded
        }
    }, [kunjungan, reset]);

    const onSubmit: SubmitHandler<KunjunganForm> = (data) => {
      const postData = async () => {
          // Send the PUT request with the correct endpoint and data
          const [responseData, message, isSuccess] = await sendRequest(
              "put",
              `kunjungan/update`,  // No need to append the ID if it's included in the data
              data,                // Pass the form data, assuming it includes the necessary ID
              true                 // true indicates that this request needs authorization (like token headers)
          );

          // If the request is successful, navigate back to the home page
          if (isSuccess) {
              router.push("/home");
          } else {
              console.error("Gagal untuk memperbarui kunjungan:", message);
          }
      };

      postData();
  };

    // Handle account change
    const handleAccount = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAccountId = event.target.value;
        const selectedAccount = accounts.find(account => account.id === selectedAccountId);
        console.log(selectedAccount);

        if (selectedAccount) {
            const listProfile = selectedAccount.listProfile;

            setProfiles(listProfile);  // Update the profiles based on the selected account
            setAccount(selectedAccount);

            // Clear the selected profile and set it to null
            setProfile(null);
        }
    };

    // Handle profile change
    const handleProfile = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProfileId = event.target.value;
        const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);

        if (selectedProfile) {
            setProfile(selectedProfile);  // Update selected profile
        }
    };

  const handleStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value;

    setStatus(selectedStatus);
  }

    // Helper functions
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatGender = (isFemale: boolean) => {
        return isFemale ? 'Perempuan' : 'Laki-laki';
    };

    return (
        <main>
            <section>
                <div className="flex justify-center md:hidden">
                    <Typography variant="h4" className="text-primary-1">Memperbarui Kunjungan</Typography>
                </div>
                <Divider className="md:hidden"/>
                {kunjungan &&
                    <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                        <div className="justify-between gap-5 my-5 md:grid-cols-2">
                            <RadioButtonGroup
                                name="sesi"
                                options={sesi}
                                label="Sesi"
                                direction="horizontal"
                                validation={{ required: "Mohon pilih sesi" }}
                                defaultValue={kunjungan?.antrian.sesi.toString()} // Preselect the sesi value
                            />
                            <Divider/>
                            <Typography variant="p1" weight="bold" className="text-primary-1 my-5">Data Pribadi</Typography>
                            <div className="justify-between gap-5 my-5">
                                {user.role !== "PASIEN" && (
                                    <SelectInput
                                        id="accountId"
                                        label="Akun"
                                        placeholder="Pilih akun"
                                        validation={{ required: "Akun wajib diisi" }}
                                        onChange={handleAccount}
                                        helperText="Pilih akun terlebih dahulu"
                                        value={account?.id}  // Pre-fill the account field
                                    >

                                        {accounts.length > 0 ? (
                                            accounts.map((account) => (
                                                <option key={account.id} value={account.id}>
                                                    {account.nip} - {account.listProfile.find(profile => profile.relative === 0)?.name ?? account.username}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">Tidak ada akun yang tersedia</option>
                                        )}
                                    </SelectInput>
                                )}
                                <SelectInput
                                    id="profileId"
                                    label="Profil"
                                    placeholder="Pilih profil"
                                    validation={{ required: "Profil wajib diisi" }}
                                    onChange={handleProfile}
                                    helperText="Pilih profil terlebih dahulu"
                                    value={profile?.id}  // Ensure the profile field is empty after account change
                                >
                                    <option value={profile?.id}>{profile?.name}</option>  {/* Add placeholder option */}

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

                                <Typography variant="p1" className="mt-2">Nama: {profile?.name}</Typography>
                                <Typography variant="p1">No. HP: {profile?.noHp}</Typography>
                                <Typography variant="p1">Tanggal Lahir: {profile?.tanggalLahir ? formatDate(profile.tanggalLahir) : '-'}</Typography>
                                <Typography variant="p1">Jenis Kelamin: {profile?.jenisKelamin !== undefined ? formatGender(profile.jenisKelamin) : '-'}</Typography>
                            </div>
                            <Divider/>
                            <Input
                                id="tanggalKunjungan"
                                label="Tanggal Kunjungan"
                                type="date"
                            />
                            {user.role !== "PASIEN" && (
                                <SelectInput
                                    id="status"
                                    label="Status"
                                    placeholder="Pilih status"
                                    onChange={handleStatus}
                                    validation={{ required: "Status wajib diisi" }}
                                    value={status}
                                >
                                    <option value="0">Belum Dilayani</option>
                                    <option value="1">Sedang Dilayani</option>
                                    <option value="2">Selesai</option>
                                    <option value="3">Dibatalkan</option>
                                </SelectInput>
                            )}
                            <TextArea
                                id="keluhan"
                                label="Keluhan"
                                placeholder="Keluhan yang dirasakan"
                                maxLength={255}
                                validation={{ required: "Mohon beri tahu keluhan Anda" }}
                                defaultValue={kunjungan?.keluhan}
                            />
                        </div>
                        <div className="mt-5 flex items-center justify-center gap-4">
                            <Button type="submit">Perbarui</Button>
                            <Link href={"/home"}>
                                <Button variant="danger">Batalkan</Button>
                            </Link>
                        </div>
                    </form>
                    </FormProvider>
                }
            </section>
        </main>
    );
};

export default withAuth(KunjunganUpdatePage, "user");
