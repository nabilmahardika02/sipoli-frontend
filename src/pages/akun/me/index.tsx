import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { removeToken } from "@/lib/cookies";
import DataTable from "@/lib/datatable";
import Head from "next/head";
import { formatDate, formatDateOnly } from "@/lib/formater";
import { LoadingDiv } from "@/components/elements/Loading";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Account } from "@/types/entities/account";
import {
  getRowIdProfile,
  profileTableColumns,
} from "@/types/table/myProfileColumn";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { TbPasswordUser } from "react-icons/tb";
import { LuPencil } from "react-icons/lu";
import IconButton from "@/components/elements/IconButton";

const DetailPage = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [selectedAccount, setAccount] = useState<Account>();
  const [isPasien, setIsPasien] = useState(true);

  useEffect(() => {
    setTitle("Akun saya");
  }, [setTitle]);

  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `auth/my-account`
      );

      if (isSuccess) {
        setAccount(responseData as Account);
      }
    };
    fetchAccount();
  }, [user?.accountId]);

  const logout = useAuthStore.useLogout();

  const handleLogout = () => {
    logout();
    removeToken();
    router.push("/login");
  };

  useEffect(() => {
    setIsPasien(selectedAccount?.role === "PASIEN");
  }, [selectedAccount]);

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
                <Link href={`/akun/me/password`}>
                  <Button
                    variant="secondary"
                    className="mt-5"
                    leftIcon={TbPasswordUser}
                  >
                    Ubah Password
                  </Button>
                </Link>
                <Button
                  className="mt-5"
                  onClick={handleLogout}
                  rightIcon={LuLogOut}
                >
                  Logout
                </Button>
              </div>
            </div>
            <Divider className="md:hidden my-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-700"
                >
                  Username
                </Typography>
                <div className="flex flex-row gap-2">
                  <Typography className="text-primary-1">
                    {selectedAccount?.username}
                  </Typography>
                  <Link href={`/akun/me/username`}>
                    <IconButton size="sm" icon={LuPencil} variant="primary" />
                  </Link>
                </div>
              </div>
              <div>
                <Typography
                  variant="p2"
                  weight="semibold"
                  className="text-gray-700"
                >
                  Role
                </Typography>
                <Typography className="text-primary-1">
                  {selectedAccount?.role}
                </Typography>
              </div>
              {isPasien ? (
                <>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-700"
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
                      className="text-gray-700"
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
                      className="text-gray-700"
                    >
                      Eselon
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.eselon}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-700"
                    >
                      Alamat
                    </Typography>
                    <Typography className="text-primary-1">
                      {selectedAccount.alamat || "-"}
                    </Typography>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Typography
                      variant="p2"
                      weight="semibold"
                      className="text-gray-700"
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
                      className="text-gray-700"
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
                      className="text-gray-700"
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
                      className="text-gray-700"
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
                  className="text-gray-700"
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
                  className="text-gray-700"
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
                    Daftar Profil
                  </Typography>
                </div>
                <DataTable
                  columns={profileTableColumns}
                  getRowId={getRowIdProfile}
                  rows={selectedAccount.listProfile}
                />
              </>
            )}
          </div>
        ) : (
          <LoadingDiv />
        )}
      </section>
    </main>
  );
};

export default withAuth(DetailPage, "user");
