import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import MyTimePicker from "@/components/elements/forms/TimePicker";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { sesi } from "@/content/kunjungan";
import { useDocumentTitle } from "@/context/Title";
import { formatDateOnly, formatTimeDayjs } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Account } from "@/types/entities/account";
import { Profile } from "@/types/entities/profile";
import { KunjunganForm } from "@/types/forms/kunjunganForm";
import Link from "next/link";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const KunjunganAddPage = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [showInformationSunday, setShowInformationSunday] = useState(false);
  const [showInformationSaturday, setShowInformationSaturday] = useState(false);
  const [showAntrianInfo, setShowAntrianInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSesi, setSelectedSesi] = useState("");
  const [antrianInfo, setAntrianInfo] = useState(0);
  const [showSesi, setShowSesi] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "PASIEN") {
      setTitle("Pendaftaran Kunjungan");
    } else {
      setTitle("Tambah Kunjungan");
    }
  }, [setTitle, user?.role]);

  useEffect(() => {
    // Fungsi untuk mengambil data profil dari API
    const fetchAccounts = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/users?role=PASIEN" // Endpoint API untuk mendapatkan seluruh data account
      );

      if (isSuccess) {
        setAccounts(responseData as Account[]); // Set data profil ke state
      }
    };

    if (user?.role !== "PASIEN") {
      fetchAccounts();
    }
  }, [user?.role]);

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

    if (user?.role === "PASIEN") {
      fetchProfiles();
    }
  }, [user]);

  const methods = useForm<KunjunganForm>({
    mode: "onTouched",
  });

  const { handleSubmit, control } = methods;

  const onSubmit: SubmitHandler<KunjunganForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "kunjungan/add",
        showInformationSunday
          ? { ...data, jamMasuk: formatTimeDayjs(data.jamMasuk) }
          : data,
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
    const selectedAccount = accounts.find(
      (account) => account.id === selectedAccountId
    );

    if (selectedAccount) {
      // Dapatkan listProfile dari account yang dipilih
      const listProfile = selectedAccount.listProfile;

      setProfiles(listProfile);
      setProfile(listProfile[0]);
    }
  };

  const handleProfile = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = event.target.value;

    const selectedProfile = profiles.find(
      (profile) => profile.id === selectedProfileId
    );

    if (selectedProfile) {
      setProfile(selectedProfile);
    }
  };

  const formatGender = (isFemale: boolean) => {
    return isFemale ? "Perempuan" : "Laki-laki";
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    const date = new Date(selectedDate);
    setSelectedDate(selectedDate);

    // Hitung tanggal maksimum (7 hari setelah hari ini)
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    if (date > maxDate) {
      setShowInformationSunday(false);
      setShowInformationSaturday(false);
      setShowSesi(false);
      setShowAntrianInfo(false);
      // Set pesan validasi
      setValidationMessage(`Hanya bisa mendaftarkan kunjungan hingga ${formatDateOnly(maxDate.toDateString())}`);
    } else {
      // Reset pesan validasi jika tanggal valid
      setValidationMessage(null);
    }

    if (date.getDay() === 0) { //sunday
      setShowInformationSunday(true);
      setShowInformationSaturday(false);
      setShowSesi(false);
      setShowAntrianInfo(false);
    } else if (date.getDay() === 6) { //saturday
      setShowInformationSaturday(true);
      setShowInformationSunday(false);
      setShowSesi(false);
      setShowAntrianInfo(false);
    } else {
      setShowInformationSunday(false);
      setShowInformationSaturday(false);
      setShowSesi(true);
      setShowAntrianInfo(false);
    }
  };

  useEffect(() => {
    // Fungsi untuk mengambil data profil dari API
    const fetchAntrian = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/antrian?sesi=" + selectedSesi + "&tanggal=" + selectedDate
      );

      if (isSuccess) {
        setAntrianInfo(responseData as number); 
      }
    };

    if (selectedSesi) {
      fetchAntrian();
    }

  }, [selectedSesi]);

  const handleSesiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSesi(event.target.value);
    setShowAntrianInfo(true);
  }

  return (
    <main>
      <section>
        <div className="flex justify-center md:hidden">
          {user?.role === "PASIEN" && (
            <Typography variant="h4" className="text-primary-1">
              Pendaftaran Kunjungan
            </Typography>
          )}
          {user?.role !== "PASIEN" && (
            <Typography variant="h4" className="text-primary-1">
              Tambah Kunjungan
            </Typography>
          )}
        </div>
        <Divider className="md:hidden" />
        {user && (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="justify-between gap-5 my-5 md:grid-cols-2">
                <Input
                  id="tanggalKunjungan"
                  label="Tanggal Kunjungan"
                  type="date"
                  validation={{ required: "Mohon pilih tanggal kunjungan" }}
                  onChange={handleDateChange}
                />
                {validationMessage !== null && (
                  <Typography variant="p2" className="my-2 text-danger-core" size="sm">
                    {validationMessage}
                  </Typography>
                )}
                {showInformationSunday && validationMessage === null && (
                  <>
                    <MyTimePicker
                      id="jamMasuk"
                      label="Jam Kunjungan"
                      control={control}
                      validation={{
                        required: "Jam Kunjungan wajib diisi",
                      }}
                    />
                    <Typography variant="p2" className="my-2 text-gray-600" size="sm">
                      Silahkan pilih waktu dalam WITA untuk berkunjung di hari Minggu
                    </Typography>
                  </>
                )}
                {showInformationSaturday && validationMessage === null && (
                  <Typography variant="p2" className="my-2 text-danger-core" size="sm">
                    Poliklinik tidak dapat melayani di hari Sabtu
                  </Typography>
                )}
                {showSesi && validationMessage === null && (<RadioButtonGroup
                  name="sesi"
                  options={sesi}
                  label="Sesi"
                  direction="horizontal"
                  onChange={handleSesiChange}
                  validation={{ required: "Mohon pilih sesi" }}
                />)}
                {showAntrianInfo && antrianInfo === 0 && (
                  <Typography variant="p2" className="my-2 text-gray-600" size="sm">
                    Belum ada antrian di sesi {selectedSesi} pada {formatDateOnly(selectedDate)}
                  </Typography>
                )}
                {showAntrianInfo && antrianInfo > 0 && (
                  <Typography variant="p2" className="my-2 text-gray-600" size="sm">
                    Sudah ada {antrianInfo} antrian di sesi {selectedSesi} pada {formatDateOnly(selectedDate)}
                  </Typography>
                )}
                <Divider />
                <Typography
                  variant="p1"
                  weight="bold"
                  className="text-primary-1 my-5"
                >
                  Data Pribadi
                </Typography>
                <div className="justify-between gap-5 my-5">
                  {user.role !== "PASIEN" && (
                    <SelectInput
                      id="accountId"
                      label="Akun"
                      placeholder="Pilih akun"
                      validation={{ required: "Akun wajib diisi" }}
                      onChange={handleAccount}
                      helperText="Pilih akun terlebih dahulu"
                    >
                      {accounts.length > 0 ? (
                        accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.listProfile[0].nik} -{" "}
                            {account.listProfile.find(
                              (profile) => profile.relative === 0
                            )?.name ?? account.username}
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
                  <Typography variant="p1" className="mt-2">
                    Nama: {profile?.name}
                  </Typography>
                  <Typography variant="p1">No. HP: {profile?.noHp}</Typography>
                  <Typography variant="p1">
                    Tanggal Lahir:{" "}
                    {profile?.tanggalLahir
                      ? formatDateOnly(profile.tanggalLahir)
                      : "-"}
                  </Typography>
                  <Typography variant="p1">
                    Jenis Kelamin:{" "}
                    {profile?.jenisKelamin !== undefined
                      ? formatGender(profile.jenisKelamin)
                      : "-"}
                  </Typography>
                </div>
                <Divider />
                {user.role !== "PASIEN" && (
                  <SelectInput
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
                )}
                <TextArea
                  id="keluhan"
                  label="Keluhan"
                  placeholder="Keluhan yang dirasakan"
                  maxLength={255}
                  validation={{ required: "Mohon beri tahu keluhan Anda" }}
                />
              </div>
              <div className="mt-5 flex items-center justify-center gap-4">
                <Button type="submit">Simpan</Button>
                <Link href={"/home"}>
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

export default withAuth(KunjunganAddPage, "user");
