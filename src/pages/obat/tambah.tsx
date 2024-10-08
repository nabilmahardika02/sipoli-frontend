import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { AddObatForm } from "@/types/forms/obatForm";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const AddObatPage = () => {
  const { setTitle } = useDocumentTitle();
  const router = useRouter();

  useEffect(() => {
    setTitle("Tambah Obat");
  }, [setTitle]);

  const methods = useForm<AddObatForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<AddObatForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "obat/add",
        data,
        true
      );

      if (isSuccess) {
        router.push("/obat");
      }
    };

    postData();
  };

  return (
    <main>
      <section className="mb-5">
        <Head>
          <title>Tambah Obat</title>
        </Head>
        <Typography variant="h4" className="mb-2 md:hidden">
          Tambah Obat
        </Typography>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5"
            method="POST"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="namaObat"
                placeholder="Nama Obat"
                validation={{ required: "Nama obat wajib diisi" }}
                label="Nama Obat"
              />
              <SelectInput
                id="jenisSatuan"
                label="Jenis Satuan"
                placeholder="Jenis Satuan"
                validation={{ required: "Jenis Satuan wajib diisi" }}
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
              />
              <Input
                id="totalStok"
                placeholder="0"
                validation={{ required: "Jumlah stok obat wajib diisi" }}
                label="Stok saat ini"
              />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Submit</Button>
              <Link href={"/obat"}>
                <Button variant="danger">Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(AddObatPage, "OPERATOR");
