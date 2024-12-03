import { LoadingDiv } from "@/components/elements/Loading";
import HasilPemeriksaan1Form from "@/components/fragments/kunjungan/HasilPemeriksaan1Form";
import HasilPemeriksaan2Form from "@/components/fragments/kunjungan/HasilPemeriksaan2Form";
import HasilPemeriksaan3Form from "@/components/fragments/kunjungan/HasilPemeriksaan3Form";
import HasilPemeriksaan4Form from "@/components/fragments/kunjungan/HasilPemeriksaan4Form";
import HasilPemeriksaan5Form from "@/components/fragments/kunjungan/HasilPemeriksaan5Form";  // Form baru untuk input obat dan resep rujukan
import HasilPemeriksaan6Form from "@/components/fragments/kunjungan/HasilPemeriksaan6Form";  // Form yang sebelumnya ada di Section 5
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { HasilPemeriksaanForm } from "@/types/forms/hasilPemeriksaanForm";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AddHasilPemeriksaanPage = () => {
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [section, setSection] = useState(1);
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const [hasilPemeriksaanFields, setHasilPemeriksaanFields] = useState<HasilPemeriksaanForm>({
    dokter: "",
    tanggalPeriksa: "",
    keluhanUtama: "",
    riwayatPenyakitSekarang: "",
    kie: "",
    tensi: "",
    suhu: 0,
    meanArteri: 0,
    respiratoryRate: 0,
    heartRate: 0,
    oxygenSaturation: 0,
    kesadaran: "",
    eye: 0,
    verbal: 0,
    motorik: 0,
    mata: "",
    telinga: "",
    hidung: "",
    tonsil: "",
    faring: "",
    cor: "",
    pulmo: "",
    abd: "",
    ext: "",
    icd10: "",
    diagnosaKerja: "",
    rencana: "",
    tindakan: "",
    deskripsi: "",
    rujukanRequestDTO: {
      tujuanRujukan: "",
      dokterRujukan: "",
      catatanRujukan: "",
    },
    listKuantitasObatDTO: [],
    resepObatRujukan: { deskripsi: "" },
  });

  useEffect(() => {
    setTitle("Tambah Hasil Pemeriksaan");
  }, [setTitle]);

  useEffect(() => {
    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan?id=" + router.query.id
      );

      if (isSuccess) {
        setKunjungan(responseData as Kunjungan);
      }
    };

    fetchKunjungan();
  }, [router.query.id]);

  return (
    <main>
      <Head>
        <title>Hasil Pemeriksaan</title>
      </Head>
      {kunjungan ? (
        <>
          {section === 1 && (
            <HasilPemeriksaan1Form
              hasilPemeriksaan={hasilPemeriksaanFields}
              setHasilPemeriksaan={setHasilPemeriksaanFields}
              setSection={setSection}
              kunjungan={kunjungan}
            />
          )}
          {section === 2 && (
            <HasilPemeriksaan2Form
              hasilPemeriksaan={hasilPemeriksaanFields}
              setHasilPemeriksaan={setHasilPemeriksaanFields}
              setSection={setSection}
              kunjungan={kunjungan}
            />
          )}
          {section === 3 && (
            <HasilPemeriksaan3Form
              hasilPemeriksaan={hasilPemeriksaanFields}
              setHasilPemeriksaan={setHasilPemeriksaanFields}
              setSection={setSection}
              kunjungan={kunjungan}
            />
          )}
          {section === 4 && (
            <HasilPemeriksaan4Form
              hasilPemeriksaan={hasilPemeriksaanFields}
              setHasilPemeriksaan={setHasilPemeriksaanFields}
              setSection={setSection}
              kunjungan={kunjungan}
            />
          )}
          {section === 5 && (
            <HasilPemeriksaan5Form
              hasilPemeriksaan={hasilPemeriksaanFields}
              setHasilPemeriksaan={setHasilPemeriksaanFields}
              setSection={setSection}
              kunjungan={kunjungan}
            />
          )}
          {section === 6 && (
            <HasilPemeriksaan6Form
              hasilPemeriksaan={hasilPemeriksaanFields}
              setHasilPemeriksaan={setHasilPemeriksaanFields}
              setSection={setSection}
              kunjungan={kunjungan}
            />
          )}
        </>
      ) : (
        <LoadingDiv />
      )}
    </main>
  );
};

export default withAuth(AddHasilPemeriksaanPage, "user");
