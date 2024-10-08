import Divider from "@/components/elements/Divider";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import sendRequest from "@/lib/getApi";
import { Profile } from "@/types/entities/profile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const jenisKelamin = [
  {
    value: "false",
    text: "Laki-laki",
  },
  {
    value: "true",
    text: "Perempuan",
  },
];

const PasienPage = () => {
  const { setTitle } = useDocumentTitle();
  const [pasien, setPasien] = useState<Profile>();
  const router = useRouter();
  const [usia, setUsia] = useState<number>();
  const [tanggalLahir, setTanggalLahir] = useState<Date>();

  if (!checkRole(["OPERATOR", "PERAWAT", "DOKTER"])) {
    router.push("/403");
  }

  useEffect(() => {
    setTitle("Detail Pasien");
  }, [setTitle]);

  useEffect(() => {
    const fetchProfile = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "profile?idProfile=" + router.query.id
      );

      if (isSuccess) {
        setPasien(responseData as Profile);
      }

      console.log(router.query.id);
    };

    fetchProfile();
  }, [router.query.id]);

  // Fungsi untuk menghitung usia
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--; // Kurangi 1 dari usia
    }

    return age;
  };

  useEffect(() => {
    if (pasien?.tanggalLahir) {
      const birthDate = new Date(pasien.tanggalLahir);
      setTanggalLahir(birthDate); // Simpan objek Date di state

      const calculatedAge = calculateAge(birthDate);
      setUsia(calculatedAge); // Simpan usia di state
    }
  }, [pasien]); // Dependensi untuk useEffect

  // Determine gender text only if pasien is defined
  const kelaminText = pasien
    ? jenisKelamin.find((jk) => jk.value === String(pasien.jenisKelamin))?.text
    : "";

  return (
    <main>
      <section>
        <div className="flex justify-center md:hidden">
          <Typography variant="h4" className="text-primary-1">
            Detail Pasien
          </Typography>
        </div>
        <Divider className="md:hidden" />
        {pasien ? (
          <div className="grid grid-cols-2 gap-5 my-5">
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Nama
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {pasien?.name}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Nomor HP
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {pasien?.noHp}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Usia
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {usia} tahun
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Jenis Kelamin
              </Typography>
              <Typography
                variant="h6"
                weight="light"
                className="text-primary-1"
              >
                {kelaminText}
              </Typography>
            </div>
          </div>
        ) : (
          <LoadingDiv />
        )}
        <Divider />
        <div className="flex justify-center my-5">
          <Typography variant="h6" className="text-gray-500">
            Belum ada rekam medis
          </Typography>
        </div>
      </section>
    </main>
  );
};

export default withAuth(PasienPage, "user");
