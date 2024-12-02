import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { removeToken } from "@/lib/cookies";
import DataTable from "@/lib/datatable";
import { formatDate } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Account } from "@/types/entities/account";
import { Profile } from "@/types/entities/profile";
import {
  getRowIdProfile,
  profileTableColumns,
} from "@/types/table/myProfileColumn";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { TbPasswordUser } from "react-icons/tb";

const DetailPage = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [selectedAccount, setAccount] = useState<Account>();
  const [profiles, setProfiles] = useState<Profile[]>();
  const [isPasien, setIsPasien] = useState(true);

  useEffect(() => {
    setTitle("Akun saya");
  }, [setTitle]);

  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/my-account"
      );

      if (isSuccess) {
        setAccount(responseData as Account);
      }
    };
    fetchAccount();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "profile/all-profile"
      );
      if (isSuccess) {
        setProfiles(responseData as Profile[]);
      }
    };
    if (user?.role === "PASIEN") {
      fetchProfile();
    }
  }, [user?.role]);

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
      <section>
        {selectedAccount && (
          <div>
            <div className="flex justify-center md:hidden">
              <Typography variant="h4" className="text-primary-1">
                Detail Akun
              </Typography>
            </div>
            <Divider className="md:hidden" />
            <div className="w-full flex items-center justify-end gap-4">
              <Button
                className="mt-5"
                onClick={handleLogout}
                rightIcon={LuLogOut}
              >
                Logout
              </Button>
            </div>
            <div className="grid grid-cols-3 justify-center gap-10 my-5">
              <div className="w-full">
                <Typography variant="p1" className="text-gray-700">
                  Username
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.username}
                </Typography>
              </div>
              <div className="w-full">
                <Typography variant="p1" className="text-gray-700">
                  Role
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.role}
                </Typography>
              </div>
              {isPasien && (
                <div className="w-full">
                  <Typography variant="p1" className="text-gray-700">
                    NIK
                  </Typography>
                  <Typography
                    variant="p1"
                    className="text-primary-1 font-medium"
                  >
                    {selectedAccount?.listProfile[0].nik ?? "-"}
                  </Typography>
                </div>
              )}
              {isPasien && (
                <div className="w-full">
                  <Typography variant="p1" className="text-gray-700">
                    Jabatan
                  </Typography>
                  <Typography
                    variant="p1"
                    className="text-primary-1 font-medium"
                  >
                    {selectedAccount?.jabatan ?? "-"}
                  </Typography>
                </div>
              )}
              {isPasien && (
                <div className="w-full">
                  <Typography variant="p1" className="text-gray-700">
                    Unit Kerja
                  </Typography>
                  <Typography
                    variant="p1"
                    className="text-primary-1 font-medium"
                  >
                    {selectedAccount?.unitKerja ?? "-"}
                  </Typography>
                </div>
              )}
              {isPasien && (
                <div className="w-full">
                  <Typography variant="p1" className="text-gray-700">
                    Eselon
                  </Typography>
                  <Typography
                    variant="p1"
                    className="text-primary-1 font-medium"
                  >
                    {selectedAccount?.eselon ?? "-"}
                  </Typography>
                </div>
              )}
              {isPasien && (
                <div className="w-full">
                  <Typography variant="p1" className="text-gray-700">
                    Alamat
                  </Typography>
                  <Typography
                    variant="p1"
                    className="text-primary-1 font-medium"
                  >
                    {selectedAccount?.alamat ?? "-"}
                  </Typography>
                </div>
              )}
              <div className="w-full">
                <Typography variant="p1" className="text-gray-700">
                  Created At
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.createdAt
                    ? formatDate(selectedAccount.createdAt)
                    : "N/A"}
                </Typography>
              </div>
              <div className="w-full">
                <Typography variant="p1" className="text-gray-700">
                  Updated At
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.updatedAt
                    ? formatDate(selectedAccount.updatedAt)
                    : "N/A"}
                </Typography>
              </div>
            </div>
            <div className="flex justify-center gap-5 my-5">
              <Link href={`/akun/me/password`}>
                <Button
                  variant="secondary"
                  className="mt-5"
                  leftIcon={TbPasswordUser}
                >
                  Ubah Password
                </Button>
              </Link>
              <div></div>
            </div>
            <Divider />
            {isPasien && (
              <div style={{ width: "100%", overflowX: "auto" }}>
                <Typography variant="h6" className="text-primary-1 my-5">
                  Daftar Profil
                </Typography>
                {profiles ? (
                  <DataTable
                    columns={profileTableColumns}
                    getRowId={getRowIdProfile}
                    rows={profiles}
                    flexColumnIndexes={[0]}
                  />
                ) : (
                  <Typography
                    variant="p1"
                    className="text-primary-1 font-medium"
                  >
                    -
                  </Typography>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default withAuth(DetailPage, "user");
