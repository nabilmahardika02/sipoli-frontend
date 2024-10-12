import useAuthStore from "@/store/useAuthStore";
import withAuth from "@/components/hoc/withAuth";
import { LoadingDiv } from "@/components/elements/Loading";
import { useDocumentTitle } from "@/context/Title";
import { Account } from "@/types/entities/account";
import { Profile } from "@/types/entities/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { removeToken } from "@/lib/cookies";
import sendRequest from "@/lib/getApi";
import Typography from "@/components/elements/Typography";
import Divider from "@/components/elements/Divider";
import Button from "@/components/elements/Button";
import DataTable from "@/lib/datatable";
import { formatDate } from "@/lib/formater";
import {
  getRowIdProfile,
  profileTableColumns,
} from "@/types/table/profileColumn";
import Link from "next/link";
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
      console.log("Data yang diterima:", responseData);
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
        console.log(profiles);
      } else {
        console.log(message);
      }
    };
    if (user?.role === "PASIEN") {
      fetchProfile();
    }
  }, []);

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
            <Button className="mt-5" onClick={handleLogout} rightIcon={LuLogOut}>Logout</Button>
          </div>
          <div className="grid grid-cols-3 justify-center gap-10 my-5">
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Username
              </Typography>
              <Typography variant="p1" className="text-primary-1 font-medium">
                {selectedAccount?.username}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Role
              </Typography>
              <Typography variant="p1" className="text-primary-1 font-medium">
                {selectedAccount?.role}
              </Typography>
            </div>
            {isPasien && (
              <div className="w-full">
                <Typography variant="p1" className="text-gray-600">
                  NIP
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.nip ?? "-"}
                </Typography>
              </div>
            )}
            {isPasien && (
              <div className="w-full">
                <Typography variant="p1" className="text-gray-600">
                  Jabatan
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.jabatan ?? "-"}
                </Typography>
              </div>
            )}
            {isPasien && (
              <div className="w-full">
                <Typography variant="p1" className="text-gray-600">
                  Unit Kerja
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.unitKerja ?? "-"}
                </Typography>
              </div>
            )}
            {isPasien && (
              <div className="w-full">
                <Typography variant="p1" className="text-gray-600">
                  Eselon
                </Typography>
                <Typography variant="p1" className="text-primary-1 font-medium">
                  {selectedAccount?.eselon ?? "-"}
                </Typography>
              </div>
            )}
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Created At
              </Typography>
              <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.createdAt ? formatDate(selectedAccount.createdAt) : "N/A"}
              </Typography>
            </div>
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Updated At
              </Typography>
              <Typography variant="p1" className="text-primary-1 font-medium">
                {selectedAccount?.updatedAt ? formatDate(selectedAccount.updatedAt) : "N/A"}
              </Typography>
            </div>
          </div>
          <div className="flex justify-center gap-5 my-5">
            <Link href={`/akun/me/password`}>
              <Button variant="secondary" className="mt-5" leftIcon={TbPasswordUser}>
                Ubah Password
              </Button>
            </Link>
            <div>
            </div>
          </div>
          <Divider />
          {isPasien && (
            <div style={{ width: "100%", overflowX: "auto" }}>
              {profiles ? (
                <DataTable
                  columns={profileTableColumns}
                  getRowId={getRowIdProfile}
                  rows={profiles}
                />
              ) : (
                <Typography variant="p1" className="text-primary-1 font-medium">
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
