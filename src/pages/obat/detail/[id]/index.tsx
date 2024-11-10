import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import { LoadingDiv } from "@/components/elements/Loading";
import { DANGER_TOAST, showToast } from "@/components/elements/Toast";
import Typography from "@/components/elements/Typography";
import RiwayatPemakaian from "@/components/fragments/obat/RiwayatPemakaian";
import RiwayatRestock from "@/components/fragments/obat/RiwayatRestock";
import withAuth from "@/components/hoc/withAuth";
import ModalLayout from "@/components/layouts/ModalLayout";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import { formatDate, getSatuanObat } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Obat } from "@/types/entities/obat";
import { RestockForm } from "@/types/forms/obatForm";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";

const DetailObatPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const router = useRouter();

  const [obat, setObat] = useState<Obat>();
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setTitle("Detail Obat");
  }, [setTitle]);

  if (!checkRole(["OPERATOR", "DOKTER", "PERAWAT"])) {
    router.push("/403");
  }

  const fetchData = useCallback(async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      "obat/" + router.query.id
    );

    if (isSuccess) {
      setObat(responseData as Obat);
    }
  }, [router.query.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const methods = useForm<RestockForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<RestockForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "obat/restock",
        {
          idObat: router.query.id,
          ...data,
        },
        true
      );

      if (isSuccess) {
        fetchData();
        setShowRestockModal(false);
        methods.reset();
      }
    };

    postData();
  };

  const handleDelete = async () => {
    try {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `obat/delete/${router.query.id}`,
        null,
        true
      );

      if (isSuccess) {
        setShowDeleteModal(false);
        router.push("/obat");
      } else {
        showToast(message, DANGER_TOAST);
      }
    } catch (error) {
      showToast("Gagal menghapus obat. Coba lagi.", DANGER_TOAST);
    }
  };

  return (
    <main className="flex flex-col gap-5">
      <Head>
        <title>Detail Obat</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden text-primary-1">
        Detail Obat
      </Typography>
      <section className="data-section">
        {obat ? (
          <>
            <div className="flex flex-wrap items-center justify-between">
              <Typography variant="h5" className="text-secondary-2">
                {obat?.namaObat}
              </Typography>
              {user?.role === "PERAWAT" && (
                <div className="flex items-center gap-2">
                  <Link href={`/obat/detail/${router.query.id}/update`}>
                    <Button
                      className="max-md:aspect-square"
                      leftIconClassName="max-md:text-md max-md:mr-0"
                      leftIcon={LuPencil}
                      variant="secondary"
                    >
                      <span className="max-md:hidden">Edit Data Obat</span>
                    </Button>
                  </Link>
                  <Button
                    className="max-md:aspect-square"
                    leftIconClassName="max-md:text-md max-md:mr-0"
                    leftIcon={FaPlus}
                    onClick={() => setShowRestockModal(true)}
                  >
                    <span className="max-md:hidden">Restock Obat</span>
                  </Button>
                  <Button
                    className="max-md:aspect-square"
                    onClick={() => setShowDeleteModal(true)}
                    leftIconClassName="max-md:text-md max-md:mr-0"
                    leftIcon={IoTrashBin}
                    variant="danger"
                    disabled={obat.deleteStatus == 1}
                  >
                    <span className="max-md:hidden">
                      {obat.deleteStatus == 1
                        ? "Penghapusan Sudah Direquest"
                        : "Hapus Obat"}
                    </span>
                  </Button>
                </div>
              )}
            </div>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Tanggal Input
                </Typography>
                <Typography className="text-primary-1">
                  {formatDate(obat.createdAt)}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Terakhir update
                </Typography>
                <Typography className="text-primary-1">
                  {formatDate(obat.updatedAt)}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Stok Obat
                </Typography>
                <Typography className="text-primary-1">
                  {obat.totalStok} {getSatuanObat(obat.jenisSatuan)}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Deskripsi
                </Typography>
                <Typography className="text-primary-1">
                  {obat.deskripsi}
                </Typography>
              </div>
            </div>
          </>
        ) : (
          <LoadingDiv />
        )}
      </section>
      {obat && <RiwayatRestock obat={obat} />}
      {obat && <RiwayatPemakaian />}
      {showRestockModal && (
        <ModalLayout setShowModal={setShowRestockModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%]">
            <Typography variant="h6" className="text-primary-1">
              Restock Obat
            </Typography>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 flex flex-col gap-2 items-end"
              >
                <Input
                  id="qty"
                  type="number"
                  placeholder="Kuantitas"
                  validation={{
                    required: "Masukkan kuantitas restock",
                    min: { value: 1, message: "Kuantitas invalid" },
                  }}
                  helperText="Kuantitas yang diisi akan ditambahkan dengan stok saat ini"
                  label="Kuantitas"
                />
                <Input
                  id="hargaBeli"
                  type="number"
                  placeholder="Harga Beli Satuan"
                  validation={{
                    required: "Masukkan harga beli",
                    min: { value: 0, message: "Harga beli invalid" },
                  }}
                  label="Harga Beli Satuan"
                />
                <Input
                  id="tanggalPembelian"
                  type="date"
                  validation={{ required: "Tanggal pembelian wajib diisi" }}
                  label="Tanggal Pembelian"
                />
                <Input
                  id="tanggalKadaluarsa"
                  type="date"
                  validation={{
                    required: "Tanggal kadaluarsa obat wajib diisi",
                  }}
                  label="Tanggal Kadaluarsa"
                />
                <Button type="submit" className="max-md:w-full">
                  Request
                </Button>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
      {showDeleteModal && (
        <ModalLayout setShowModal={setShowDeleteModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
            <Typography variant="h6" className="text-primary-1">
              Hapus Obat
            </Typography>
            <Divider className="my-2" weight="kurus" />
            <Typography
              variant="p2"
              weight="semibold"
              className="text-secondary-4"
            >
              Yakin ingin menghapus obat ini?
            </Typography>
            <Typography variant="p2" className="text-primary-1 mt-2">
              <ul className="list-disc pl-4">
                <li>Obat yang sudah dihapus tidak dapat dibuka kembali.</li>
                <li>
                  Anda tidak dapat membuat obat baru dengan nama yang sama.
                </li>
                <li>
                  Nama obat tetap muncul pada resep obat yang sudah dibuat.
                </li>
              </ul>
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Hapus
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        </ModalLayout>
      )}
    </main>
  );
};

export default withAuth(DetailObatPage, "user");
