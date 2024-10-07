import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Profile } from "@/types/entities/profile";
import { Obat } from "@/types/entities/obat";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";

const RekamMedisAddPage = () => {
const user = useAuthStore.useUser();
const { setTitle } = useDocumentTitle();
const [profiles, setProfiles] = useState<Profile[]>([]);
const [obatList, setObatList] = useState<Obat[]>([]);
const [profile, setProfile] = useState<Profile | null>(null);
const [obatSelected, setObatSelected] = useState<{id: string, kuantitas: number}[]>([]);
const router = useRouter();
    useEffect(() => {
        setTitle("Tambah Rekam Medis");
    }, [setTitle]);

    // Fetch profiles
    useEffect(() => {
        const fetchProfiles = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "get",
                "profile/all-profile"
            );
            if (isSuccess) {
                setProfiles(responseData as Profile[]);
            }
        };

        fetchProfiles();
    }, []);

    // Fetch obat data
    useEffect(() => {
        const fetchObat = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "get",
                "obat/all-obat"
            );
            if (isSuccess) {
                setObatList(responseData as Obat[]);
            }
        };

        fetchObat();
    }, []);

    const methods = useForm({
        mode: "onTouched",
    });

    const { handleSubmit, watch, register, setValue } = methods;

    const onSubmit: SubmitHandler<any> = async (data) => {
        const [responseData, message, isSuccess] = await sendRequest(
            "post",
            "rekam-medis/add",
            data,
            true
        );
        if (isSuccess) {
            router.push("/home");
        }
    };

    const handleAddObat = () => {
        const obatId = watch("obatId");
        const kuantitas = watch("kuantitasObat");
        if (obatId && kuantitas > 0) {
            setObatSelected([...obatSelected, { id: obatId, kuantitas }]);
        }
    };

    return (
        <main>
            <section>
                {user && (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                            <Typography variant="h4" weight="bold" className="text-primary-1 mb-5">
                                Rekam Medis Pasien
                            </Typography>

                            {/* Informasi Pasien */}
                            <Typography variant="h4" weight="bold" className="mt-8">
                                Informasi Pasien
                            </Typography>
                            <div className="grid grid-cols-2 gap-5">
                                <SelectInput
                                    id="profileId"
                                    label="Nama Pasien"
                                    placeholder="Pilih profil"
                                    validation={{ required: "Profil wajib diisi" }}
                                    onChange={(e) => setValue("profileId", e.target.value)}
                                >
                                    {profiles.map((profile) => (
                                        <option key={profile.id} value={profile.id}>
                                            {profile.name}
                                        </option>
                                    ))}
                                </SelectInput>

                                <Input
                                    id="tanggalKunjungan"
                                    label="Tanggal Kunjungan"
                                    type="date"
                                    validation={{ required: "Tanggal kunjungan wajib diisi" }}
                                />

                                <Input
                                    id="tinggiBadan"
                                    label="Tinggi Badan"
                                    type="number"
                                    placeholder="Input Here"
                                    validation={{ required: "Tinggi badan wajib diisi" }}
                                />

                                <Input
                                    id="beratBadan"
                                    label="Berat Badan"
                                    type="number"
                                    placeholder="Input Here"
                                    validation={{ required: "Berat badan wajib diisi" }}
                                />

                                <Input
                                    id="tensiDarah"
                                    label="Tensi Darah"
                                    placeholder="Input Here"
                                    validation={{ required: "Tensi darah wajib diisi" }}
                                />
                            </div>

                            {/* Keluhan */}
                            <Typography variant="h4" weight="bold" className="mt-8">
                                Keluhan
                            </Typography>
                            <TextArea
                                id="keluhan"
                                label="Detail Keluhan"
                                placeholder="Input Here"
                                validation={{ required: "Keluhan wajib diisi" }}
                            />

                            {/* Diagnosis */}
                            <Typography variant="h4" weight="bold" className="mt-8">
                                Diagnosis
                            </Typography>
                            <TextArea
                                id="diagnosis"
                                label="Detail Diagnosis"
                                placeholder="Input Here"
                                validation={{ required: "Diagnosis wajib diisi" }}
                            />

                            {/* Obat */}
                            <Typography variant="h4" weight="bold" className="mt-8">
                                Obat
                            </Typography>
                            <div className="grid grid-cols-3 gap-5">
                                <SelectInput
                                    id="obatId"
                                    label="Nama Obat"
                                    placeholder="Pilih Obat"
                                    validation={{ required: "Pilih obat" }}
                                >
                                    {obatList.map((obat) => (
                                        <option key={obat.id} value={obat.id}>
                                            {obat.nama} (Stok: {obat.stok})
                                        </option>
                                    ))}
                                </SelectInput>

                                <Input
                                    id="kuantitasObat"
                                    label="Kuantitas"
                                    type="number"
                                    placeholder="1"
                                    validation={{ required: "Kuantitas wajib diisi" }}
                                />

                                <Button type="button" onClick={handleAddObat}>
                                    + Tambah
                                </Button>
                            </div>

                            {/* Resep Obat */}
                            <Typography variant="h4" weight="bold" className="mt-8">
                                Resep Obat
                            </Typography>
                            <TextArea
                                id="resepObat"
                                label="Detail Resep Obat"
                                placeholder="Input Here"
                            />

                            {/* Rujukan */}
                            <Typography variant="h4" weight="bold" className="mt-8">
                                Rujukan
                            </Typography>
                            <div className="grid grid-cols-3 gap-5">
                                <Input id="rujukanKepada" label="Kepada" placeholder="Input Here" />
                                <Input
                                    id="rujukanRumahSakit"
                                    label="Rumah Sakit"
                                    placeholder="Input Here"
                                />
                                {/* gak jadi ada catatan internal! */}
                                {/* <TextArea
                                    id="rujukanCatatan"
                                    label="Catatan"
                                    placeholder="Input Here"
                                /> */}
                            </div>

                            {/* Submit Buttons */}
                            <div className="mt-5 flex items-center gap-4">
                                <Button type="submit">Simpan</Button>
                                <Link href="/home">
                                    <Button variant="danger">Batal</Button>
                                </Link>
                            </div>
                        </form>
                    </FormProvider>
                )}
            </section>
        </main>
    );

};

export default withAuth(RekamMedisAddPage, "user");








