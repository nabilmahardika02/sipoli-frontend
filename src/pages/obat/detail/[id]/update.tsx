import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { Obat } from "@/types/entities/obat";
import { UpdateObatForm } from "@/types/forms/obatForm";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const UpdatePage = () => {
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [obat, setObat] = useState<Obat>();

  useEffect(() => {
    setTitle("Update Obat");
  }, [setTitle]);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/" + router.query.id
      );

      if (isSuccess) {
        setObat(responseData as Obat);
      }
    };

    fetchData();
  }, [router.query.id]);

  const methods = useForm<UpdateObatForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateObatForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "obat/update",
        {
          id: router.query.id,
          namaObat: data.namaObat,
          deskripsi: data.deskripsi,
          jenisSatuan: data.jenisSatuan,
        },
        true
      );

      if (isSuccess) {
        router.push(`/obat/detail/${router.query.id}`);
      }
    };

    postData();
  };

  return (
    <main>
      <Head>
        <title>Ubah Data Obat</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden text-primary-1">
        Ubah Data Obat
      </Typography>
      {obat && (
        <section className="mb-5">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="namaObat"
                  placeholder="Nama Obat"
                  validation={{ required: "Nama obat wajib diisi" }}
                  label="Nama Obat"
                  defaultValue={obat.namaObat}
                />
                <SelectInput
                  id="jenisSatuan"
                  label="Jenis Satuan"
                  placeholder="Jenis Satuan"
                  validation={{ required: "Jenis Satuan wajib diisi" }}
                  defaultValue={obat.jenisSatuan}
                >
                  <option value="0">Botol</option>
                  <option value="1">Strip</option>
                  <option value="2">Tablet</option>
                  <option value="3">Kapsul</option>
                  <option value="4">Tube</option>
                  <option value="5">Patch</option>
                  <option value="6">Lainnya</option>
                </SelectInput>
                <TextArea
                  id="deskripsi"
                  label="Deskripsi"
                  placeholder="Masukkan deskripsi obat"
                  maxLength={255}
                  defaultValue={obat.deskripsi}
                />
              </div>
              <div className="mt-5 flex items-center gap-4">
                <Button type="submit">Submit</Button>
                <Link href={"/obat/detail/" + router.query.id}>
                  <Button variant="danger">Cancel</Button>
                </Link>
              </div>
            </form>
          </FormProvider>
        </section>
      )}
    </main>
  );
};

export default withAuth(UpdatePage, "PERAWAT");
