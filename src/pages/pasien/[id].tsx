import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import sendRequest from "@/lib/getApi";
import { Profile } from "@/types/entities/profile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PasienPage = () => {
  const { setTitle } = useDocumentTitle();
  const [pasien, setPasien] = useState<Profile>();
  const router = useRouter();

  if (!checkRole(["OPERATOR", "PERAWAT"])) {
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

      console.log(router.query.id);

      if (isSuccess) {
        setPasien(responseData as Profile);
      } else {
        console.log(message);
      }

      console.log(pasien);
    };

    fetchProfile();
  }, [router.query.id]);

  return (
    <main>
      <section>
        <Typography>{pasien?.name}</Typography>
        <Typography>{pasien?.noHp}</Typography>
        <Typography>{pasien?.tanggalLahir}</Typography>
        <Typography>{pasien?.jenisKelamin}</Typography>
      </section>
    </main>
  );
};

export default withAuth(PasienPage, "user");
