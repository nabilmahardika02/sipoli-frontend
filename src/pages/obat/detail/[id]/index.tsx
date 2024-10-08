import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import { LoadingDiv } from "@/components/elements/Loading";
import { DANGER_TOAST, showToast } from "@/components/elements/Toast";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import ModalLayout from "@/components/layouts/ModalLayout";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import DataTable from "@/lib/datatable";
import { formatDate, getSatuanObat } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Obat } from "@/types/entities/obat";
import { RestockForm } from "@/types/forms/obatForm";
import { getRowIdRestock, restockColumn } from "@/types/table/obatColumn";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";

const DetailObatPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const router = useRouter();

  const [title, setPageTitle] = useState("Detail Obat");
  const [obat, setObat] = useState<Obat>();
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setTitle("Detail Obat");
  }, [setTitle, title]);

  if (!checkRole(["OPERATOR", "DOKTER", "PERAWAT"])) {
    router.push("/403");
  }

  const fetchData = async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      "obat/" + router.query.id
    );

    if (isSuccess) {
      setObat(responseData as Obat);

      if (obat) {
        setPageTitle(obat.namaObat);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [router.query.id]);

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
          qty: data.qty,
          tanggalPembelian: data.tanggalPembelian,
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

  return (
    <main>
      <Head>
        <title>{title}</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden text-primary-1">
        Detail Obat
      </Typography>
      {obat ? (
        <section className="max-md:p-5 max-md:rounded-xl max-md:bg-white max-md:border max-md:border-gray-200 max-md:shadow-md">
          <div className="flex flex-wrap items-center justify-between">
            <Typography variant="h6" className="text-secondary-2">
              {obat?.namaObat}
            </Typography>
            {user?.role === "OPERATOR" && (
              <div className="flex items-center gap-2">
                <IconButton
                  className="md:hidden"
                  variant="secondary"
                  icon={LuPencil}
                />
                <IconButton
                  className="md:hidden"
                  icon={FaPlus}
                  onClick={() => setShowRestockModal(true)}
                />
                <Link href={`/obat/detail/${router.query.id}/update`}>
                  <Button
                    className="max-md:hidden"
                    leftIcon={LuPencil}
                    variant="secondary"
                  >
                    Edit Data Obat
                  </Button>
                </Link>
                <Button
                  className="max-md:hidden"
                  leftIcon={FaPlus}
                  onClick={() => setShowRestockModal(true)}
                >
                  Restock Obat
                </Button>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  className="max-md:hidden"
                  leftIcon={IoTrashBin}
                  variant="danger"
                >
                  Hapus Obat
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
          <Typography
            variant="p1"
            weight="semibold"
            className="text-gray-400 mt-4 mb-2"
          >
            Riwayat Restock
          </Typography>
          <div className="w-full md:w-[50%]">
            {obat.listRestockObat.length > 0 ? (
              <DataTable
                columns={restockColumn}
                getRowId={getRowIdRestock}
                rows={obat.listRestockObat}
              />
            ) : (
              <Typography className="text-gray-500 p-4 rounded-lg border border-gray-300 w-full text-center">
                Belum ada riwayat restock
              </Typography>
            )}
          </div>
        </section>
      ) : (
        <LoadingDiv />
      )}
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
                  validation={{ required: "Kuantitas restock wajib diisi" }}
                  helperText="Kuantitas yang diisi akan ditambahkan dengan stok saat ini"
                  label="Kuantitas"
                />
                <Input
                  id="tanggalPembelian"
                  type="date"
                  placeholder="Kuantitas"
                  validation={{ required: "Tanggal pembelian wajib diisi" }}
                  label="Tanggal Pembelian"
                />
                <Button type="submit" className="max-md:w-full">
                  Add
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
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  showToast("Belum bisa ini kerjaan Nafriel", DANGER_TOAST)
                }
              >
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
