import { LoadingDiv } from "@/components/elements/Loading";
import DataKebiasaan from "@/components/fragments/pasien/DataKebiasaan";
import DataRekamMedis from "@/components/fragments/pasien/DataRekamMedis";
import DataRiwayatKeluarga from "@/components/fragments/pasien/DataRiwayatKeluarga";
import DataRiwayatPenyakit from "@/components/fragments/pasien/DataRiwayatPenyakit";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import sendRequest from "@/lib/getApi";
import { Pasien } from "@/types/entities/profile";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const PasienPage = () => {
  const { setTitle } = useDocumentTitle();
  const [pasien, setPasien] = useState<Pasien>();
  const [trigger, setTrigger] = useState(false);
  const router = useRouter();

  if (!checkRole(["PERAWAT", "DOKTER"])) {
    router.push("/403");
  }

  useEffect(() => {
    setTitle("Detail Pasien");
  }, [setTitle]);

  const fetchProfile = useCallback(async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      "profile/detail/" + router.query.id
    );

    if (isSuccess) {
      setPasien(responseData as Pasien);
    }
  }, [router.query.id]);

  useEffect(() => {
    fetchProfile();
  }, [router.query.id, fetchProfile, trigger]);

  return (
    <main className="flex flex-col gap-5">
      <Head>
        <title>Detail Pasien</title>
      </Head>
      {pasien ? (
        <>
          <DataRekamMedis
            pasien={pasien}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataKebiasaan
            pasien={pasien}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataRiwayatPenyakit
            pasien={pasien}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <DataRiwayatKeluarga
            pasien={pasien}
            trigger={trigger}
            setTrigger={setTrigger}
          />
        </>
      ) : (
        <LoadingDiv />
      )}
    </main>
  );
};

export default withAuth(PasienPage, "user");
