import useAuthStore from "@/store/useAuthStore";
import withAuth from "@/components/hoc/withAuth";
import { LoadingDiv } from "@/components/elements/Loading";
import { useDocumentTitle } from "@/context/Title";
import { Account } from "@/types/entities/account";
import { Profile } from "@/types/entities/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { removeToken } from "@/lib/cookies";
import ModalLayout from "@/components/layouts/ModalLayout";
import sendRequest from "@/lib/getApi";
import Typography from "@/components/elements/Typography";
import Divider from "@/components/elements/Divider";
import Button from "@/components/elements/Button";
import DataTable from "@/lib/datatable";
import {
  getRowIdProfile,
  profileTableColumns,
} from "@/types/table/profileColumn";
import Link from "next/link";
import password from "./password";

const DetailPage = () => {
  const user = useAuthStore.useUser();
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [selectedAccount, setAccount] = useState<Account>();
  const [profiles, setProfiles] = useState<Profile[]>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
  }, [selectedAccount]);

  const logout = useAuthStore.useLogout();

  const handleLogout = () => {
    logout();
    removeToken();
    router.push("/login");
  };

  const handleDelete = () => {
    const softDelete = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "auth/soft-delete-user" + router.query.id,
        true
      );
    };
    softDelete();
    setShowDeleteModal(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility state
  };

  return (
    <main>
      <section>
        <div className="flex justify-center md:hidden">
          <Typography variant="h4" className="text-primary-1">
            Detail Akun
          </Typography>
        </div>
        <Divider className="md:hidden" />
        <div className="grid grid-cols-3 justify-center gap-10 my-5">
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              User ID
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.id} 
            </Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              Username
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.username}
            </Typography>
          </div>
          <div className="w-full align-top">
            <Button className="mt-5" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              Role
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.role}
            </Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              NIP
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.nip ?? "-"}
            </Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              Jabatan
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.jabatan}
            </Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              Unit Kerja
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.unitKerja}
            </Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              Eselon
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.eselon}
            </Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              Created At
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.createdAt ?? "-"}
            </Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">
              Updated At
            </Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">
              {selectedAccount?.updatedAt}
            </Typography>
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-1 justify-center gap-10 my-5">
          <div className="w-full items-center">
            <Typography variant="p1" className="text-gray-600">
              Password
            </Typography>
            <div className="w-full flex items-center">
              <input
                type="password"
                value={selectedAccount?.password}
                readOnly
                className="ml-3 bg-transparent border-none outline-none text-primary-1 font-medium"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-5 my-5">
          <Link href={`/akun/me/password`}>
            <Button variant="secondary" className="mt-5">
              Ubah Password
            </Button>
          </Link>
        </div>
        <Divider />
        <div style={{ width: "100%", overflowX: "auto" }}>
          {profiles ? (
            <DataTable
              columns={profileTableColumns}
              getRowId={getRowIdProfile}
              rows={profiles} // Mengatur urutan sort (ascending, descending)
            />
          ) : (
            <Typography variant="p1" className="text-gray-600">
             -
            </Typography>
          )}
        </div>
      </section>
    </main>
  );
};

export default withAuth(DetailPage, "user");
