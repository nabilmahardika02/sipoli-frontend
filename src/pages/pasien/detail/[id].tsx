import { LoadingDiv } from "@/components/elements/Loading";
import DataKebiasaan from "@/components/fragments/pasien/DataKebiasaan";
import DataRekamMedis from "@/components/fragments/pasien/DataRekamMedis";
import DataRiwayatKeluarga from "@/components/fragments/pasien/DataRiwayatKeluarga";
import DataRiwayatPenyakit from "@/components/fragments/pasien/DataRiwayatPenyakit";
import DataDaftarRekamMedis from "@/components/fragments/pasien/DataDaftarRekamMedis";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Pasien } from "@/types/entities/profile";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const PasienPage = () => {
  const { setTitle } = useDocumentTitle();
  const [pasien, setPasien] = useState<Pasien>();
  const [trigger, setTrigger] = useState(false);
  const router = useRouter();
  const user = useAuthStore.useUser();

  useEffect(() => {
    if (!["PERAWAT", "DOKTER", "PASIEN"].includes(user?.role ?? "")) {
      router.push("/403");
    }
  }, [user, router]);

  useEffect(() => {
    setTitle("Detail Pasien");
  }, [setTitle]);

  const fetchProfile = useCallback(async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      `/profile/detail/${router.query.id}`
    );

    if (isSuccess) {
      setPasien(responseData as Pasien);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (router.query.id) {
      fetchProfile();
    }
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
          {["DOKTER", "PERAWAT"].includes(user?.role ?? "") && (
            <DataDaftarRekamMedis
              pasien={pasien}
              trigger={trigger}
              setTrigger={setTrigger}
            />
          )}
        </>
      ) : (
        <LoadingDiv />
      )}
    </main>
  );
};

export default withAuth(PasienPage, "user");
