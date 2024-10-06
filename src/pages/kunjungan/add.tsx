import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import router from "next/router";
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

const KunjunganAddPage = () => {
    const user = useAuthStore.useUser();
    const { setTitle } = useDocumentTitle();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [profile, setProfile] = useState<Profile>();
    const [account, setAccount] = useState<Account>();

    {user?.role === "PASIEN" && useEffect(() => {
        setTitle("Pendaftaran Kunjungan");
    }, [setTitle]);}

    {user?.role !== "PASIEN" && useEffect(() => {
        setTitle("Tambah Kunjungan");
    }, [setTitle]);}

    useEffect(() =>{
        // Fungsi untuk mengambil data profil dari API
        const fetchAccounts = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "get",
                "auth/users?role=PASIEN",  // Endpoint API untuk mendapatkan seluruh data account
                
            );

            if (isSuccess) {
                setAccounts(responseData as Account[]); // Set data profil ke state
            }

            console.log("Data yang diterima:", responseData); 
        };

        fetchAccounts();
    }, []);

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

        if (user?.role === "PASIEN") {
            fetchProfiles();
        };
        
    }, []);

    const methods = useForm<KunjunganForm>({
        mode: "onTouched",
    });

    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<KunjunganForm> = (data) => {
        const postData = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "post",
                "kunjungan/add",
                data,
                true
            );

            if (isSuccess) {
                router.push("/home");
            }
        };

        postData();
    };

    const handleAccount = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAccountId = event.target.value;
        
        // Temukan account berdasarkan accountId yang dipilih
        const selectedAccount = accounts.find(account => account.id === selectedAccountId);
        
        if (selectedAccount) {
            // Dapatkan listProfile dari account yang dipilih
            const listProfile = selectedAccount.listProfile;
    
            setProfiles(listProfile);
            setAccount(selectedAccount);
        }
    };

    const handleProfile = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProfileId = event.target.value;

        const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);

        if (selectedProfile) {
            setProfile(selectedProfile);
        }

        console.log(selectedProfileId);
        console.log(selectedProfile);
    };

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
                    {user?.role === "PASIEN" && <Typography variant="h4" className="text-primary-1">Pendaftaran Kunjungan</Typography>}
                    {user?.role !== "PASIEN" && <Typography variant="h4" className="text-primary-1">Tambah Kunjungan</Typography>}
                </div>
                <Divider className="md:hidden"/>
                {user &&
                    <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                        <div className="justify-between gap-5 my-5 md:grid-cols-2">
                            <RadioButtonGroup
                                name="sesi"
                                options={sesi}
                                label="Sesi"
                                direction="horizontal"
                                validation={{ required: "Mohon pilih sesi" }}
                            />
                            <Divider/>
                            <Typography variant="p1" weight="bold" className="text-primary-1 my-5">Data Pribadi</Typography>
                            <div className="justify-between gap-5 my-5">
                                {user.role !== "PASIEN" && <SelectInput
                                        id="accountId"
                                        label="Account"
                                        placeholder="Pilih akun"
                                        validation={{ required: "Akun wajib diisi" }}
                                        onChange={handleAccount}
                                        helperText="Pilih akun terlebih dahulu"
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
                                }
                                <SelectInput
                                    id="profileId"
                                    label="Profil"
                                    placeholder="Pilih profil"
                                    validation={{ required: "Profil wajib diisi" }}
                                    onChange={handleProfile}
                                    helperText="Pilih profil terlebih dahulu"
                                    
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
                                <Typography variant="p1" className="mt-2">Nama: {profile?.name}</Typography>
                                <Typography variant="p1">No. HP: {profile?.noHp}</Typography>
                                <Typography variant="p1">Tanggal Lahir: {profile?.tanggalLahir ? formatDate(profile.tanggalLahir) : '-'}</Typography>
                                <Typography variant="p1">Jenis Kelamin: {profile?.jenisKelamin !== undefined ? formatGender(profile.jenisKelamin) : '-'}</Typography>
                            </div>
                            <Divider/>
                            {user.role !== "PASIEN" && <Input
                                id="tanggalKunjungan"
                                label="Tanggal Kunjungan"
                                type="date"
                            />}
                            {user.role !== "PASIEN" && <SelectInput
                                    id="status"
                                    label="Status"
                                    placeholder="Pilih status"
                                    validation={{ required: "Status wajib diisi" }}
                                    
                                >
                                    <option value="0">Belum Dilayani</option>
                                    <option value="1">Sedang Dilayani</option>
                                    <option value="2">Selesai</option>
                                    <option value="3">Dibatalkan</option>
                                </SelectInput>
                            }
                            <TextArea
                                id="keluhan"
                                label="Keluhan"
                                placeholder="Keluhan yang dirasakan"
                                maxLength={255}
                                validation={{ required: "Mohon beri tahu keluhan Anda" }}
                            />
                        </div>
                        <div className="mt-5 flex items-center justify-center gap-4">
                            <Button type="submit">Submit</Button>
                            <Link href={"/home"}>
                                <Button variant="danger">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                    </FormProvider>
                }
            </section>
        </main>
    );
};

export default withAuth(KunjunganAddPage, "user");
