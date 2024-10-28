import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import ModalLayout from "@/components/layouts/ModalLayout";
import { useDocumentTitle } from "@/context/Title";
import DataTable from "@/lib/datatable";
import { formatDate, formatDateOnly } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import {
  getRowIdProfile,
  profileTableColumns,
} from "@/types/table/profileColumn";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoTrashBin } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { TbPasswordUser } from "react-icons/tb";

const DetailPage = () => {
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [selectedAccount, setAccount] = useState<Account>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPasien, setIsPasien] = useState(true);

  useEffect(() => {
    setTitle("Detail Akun");
  }, [setTitle]);

  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `auth/detail/${router.query.id}`
      );

      if (isSuccess) {
        setAccount(responseData as Account);
      }
    };
    fetchAccount();
  }, [router.query.id]);

  useEffect(() => {
    setIsPasien(selectedAccount?.role === "PASIEN");
  }, [selectedAccount]);

  const handleDelete = () => {
    const softDelete = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "delete",
        `auth/delete/${router.query.id}`,
        true
      );
    };
    softDelete();
    setShowDeleteModal(false);
    router.push("/akun");
  };

  return (
    <main>
      <Head>
        <title>Detail Akun</title>
      </Head>
      <section className="max-md:p-5 max-md:rounded-xl max-md:bg-white max-md:border max-md:border-gray-200 max-md:shadow-md">
        {selectedAccount ? (
          <div>
            <div className="flex justify-between md:justify-end items-center">
              <Typography variant="h5" className="text-primary-1 md:hidden">
                Detail Akun
              </Typography>
              <div className="flex flex-wrap md:justify-end gap-2">
                <Link
                  href={`/akun/detail/${router.query.id}/password-by-admin`}
                >
                  <Button
                    variant="secondary"
                    leftIcon={TbPasswordUser}
                    leftIconClassName="max-md:mr-0"
                  >
                    <span className="max-md:hidden">Ubah Password</span>
                  </Button>
                </Link>
                <Link href={`/akun/detail/${router.query.id}/update`}>
                  <Button
                    variant="success"
                    leftIcon={LuPencil}
                    leftIconClassName="max-md:mr-0"
                  >
                    <span className="max-md:hidden">Perbarui Akun</span>
                  </Button>
                </Link>
                <div>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="danger"
                    leftIcon={IoTrashBin}
                    leftIconClassName="max-md:mr-0"
                  >
                    <span className="max-md:hidden">Hapus Akun</span>
                  </Button>
                </div>
              </div>
            </div>
            <Divider className="md:hidden my-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Username
                </Typography>
                <Typography className="text-primary-1">
                  {selectedAccount.username}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Role
                </Typography>
                <Typography className="text-primary-1">
                  {selectedAccount.role}
                </Typography>
              </div>
              {isPasien ? (
                <>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-400"
                    >
                      Jabatan
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.jabatan}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-400"
                    >
                      Unit Kerja
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.unitKerja}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-400"
                    >
                      Eselon
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.eselon}
                    </Typography>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-400"
                    >
                      Nama
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.listProfile[0].name}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-400"
                    >
                      Jenis Kelamin
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.listProfile[0].jenisKelamin
                        ? "Perempuan"
                        : "Laki-laki"}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-400"
                    >
                      Nomor HP
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.listProfile[0].noHp || "-"}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-400"
                    >
                      Tanggal Lahir
                    </Typography>
                    <Typography className="text-primary-1">
                      {formatDateOnly(
                        selectedAccount.listProfile[0].tanggalLahir
                      )}
                    </Typography>
                  </div>
                </>
              )}
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Tanggal Registrasi
                </Typography>
                <Typography className="text-primary-1">
                  {formatDate(selectedAccount.createdAt)}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-400"
                >
                  Terakhir Diubah
                </Typography>
                <Typography className="text-primary-1">
                  {formatDate(selectedAccount.updatedAt)}
                </Typography>
              </div>
            </div>
            {isPasien && selectedAccount.listProfile && (
              <>
                <Divider weight="thin" />
                <div className="flex items-center justify-between my-2">
                  <Typography
                    weight="bold"
                    variant="h7"
                    className="text-primary-1"
                  >
                    Daftar Profile
                  </Typography>
                  <Link href={`/akun/profile/tambah/${router.query.id}`}>
                    <Button leftIcon={GoPlus}>Tambah</Button>
                  </Link>
                </div>
                <DataTable
                  columns={profileTableColumns}
                  getRowId={getRowIdProfile}
                  rows={selectedAccount.listProfile}
                  flexColumnIndexes={[0, 2]}
                />
              </>
            )}
          </div>
        ) : (
          <LoadingDiv />
        )}
      </section>

      {showDeleteModal && (
        <ModalLayout setShowModal={setShowDeleteModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
            <Typography variant="h6" className="text-primary-1">
              Hapus Akun
            </Typography>
            <Divider className="my-2" weight="kurus" />
            <Typography
              variant="p2"
              weight="semibold"
              className="text-secondary-4"
            >
              Yakin ingin menghapus akun ini?
            </Typography>
            <Typography variant="p2" className="text-primary-1 mt-2">
              Setelah dihapus, akun{" "}
              <span className="font-bold">{selectedAccount?.username}</span>{" "}
              tidak dapat diakses lagi. Semua profil yang terkait dengan akun
              tersebut akan terhapus
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button variant="danger" size="sm" onClick={() => handleDelete()}>
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

export default withAuth(DetailPage, "OPERATOR");
