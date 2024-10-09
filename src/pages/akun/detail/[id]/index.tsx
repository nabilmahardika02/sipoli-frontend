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
import { formatDate } from "@/lib/formater";
import { LuPencil } from "react-icons/lu";
import { IoTrashBin } from "react-icons/io5";
import { TbPasswordUser } from "react-icons/tb";
import {
  getRowIdProfile,
  profileTableColumns,
} from "@/types/table/profileColumn";
import Link from "next/link";

const DetailPage = () => {
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [selectedAccount, setAccount] = useState<Account>();
  const [profiles, setProfiles] = useState<Profile[]>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPasien, setIsPasien] = useState(true);

  useEffect(() => {
    setTitle("Detail Akun");
  }, [setTitle]);

  useEffect(() => {
    const fetchAccount = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `auth/get-account-by-id?id=${router.query.id}`
      );

      if (isSuccess) {
        setAccount(responseData as Account);
        console.log(selectedAccount);
      }
    };
    fetchAccount();
  }, [router.query.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        `profile/all?idAccount=${router.query.id}`
      );
      if (isSuccess) {
        setProfiles(responseData as Profile[]);
        console.log(profiles);
      } else {
        console.log(message);
      }
    };
    if (selectedAccount?.role === "PASIEN") {
      fetchProfile();
    }
  }, [selectedAccount]);

  useEffect(() => {
    setIsPasien(selectedAccount?.role === "PASIEN");
  }, [selectedAccount]);

  const handleDelete = () => {
    const softDelete = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `auth/soft-delete-user?accountID=${router.query.id}`,
        true
      );
    };
    softDelete();
    setShowDeleteModal(false);
    router.push("/akun");
  };

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
                {selectedAccount?.nip ?? "N/A"}
              </Typography>
            </div>
          )}
          {isPasien && (
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Jabatan
              </Typography>
              <Typography variant="p1" className="text-primary-1 font-medium">
                {selectedAccount?.jabatan ?? "N/A"}
              </Typography>
            </div>
          )}
          {isPasien && (
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Unit Kerja
              </Typography>
              <Typography variant="p1" className="text-primary-1 font-medium">
                {selectedAccount?.unitKerja ?? "N/A"}
              </Typography>
            </div>
          )}
          {isPasien && (
            <div className="w-full">
              <Typography variant="p1" className="text-gray-600">
                Eselon
              </Typography>
              <Typography variant="p1" className="text-primary-1 font-medium">
                {selectedAccount?.eselon ?? "N/A"}
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
          <Link href={`/akun/detail/${router.query.id}/password-by-admin`}>
            <Button variant="secondary" className="mt-5" leftIcon={TbPasswordUser}>
              Ubah Password
            </Button>
          </Link>
          <Link href={`/akun/detail/${router.query.id}/update`}>
            <Button variant="secondary" className="mt-5" leftIcon={LuPencil}>
              Perbarui Akun
            </Button>
          </Link>
          <div>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="danger"
              className="mt-5"
              leftIcon={IoTrashBin}
            >
              Hapus Akun
            </Button>
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
              {`Setelah dihapus, akun ${selectedAccount?.username} tidak dapat diakses lagi. 
            Semua profil yang terkait dengan akun tersebut akan terhapus`}
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
