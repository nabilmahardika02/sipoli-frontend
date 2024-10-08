import useAuthStore from "@/store/useAuthStore";
import withAuth from "@/components/hoc/withAuth";
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
import { getRowIdProfile, profileTableColumns } from "@/types/table/profileColumn";

const DetailPage = () => {
    const user = useAuthStore.useUser();
    const { setTitle } = useDocumentTitle();
    const [selectedAccount, setAccount] = useState<Account>();
    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        setTitle("Akun saya");
    }, [setTitle]);
    
    useEffect(() => {
        const fetchAccount = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "get",
                "auth/all"
            );
    
            if (isSuccess) {
                setAccount(responseData as Account);
            }
            console.log("Data yang diterima:", responseData);
            fetchAccount();
        }
    })

    useEffect(() => {
        const fetchProfile = async () => {
            const [responseData, message, isSuccess] = await sendRequest(
                "get",
                "profile/all-profile"
            );
            if (isSuccess) {
                setProfiles(responseData as Profile[]);
            }
            console.log("Data yang diterima:", responseData);
            if (user?.role === "PASIEN") {
                fetchProfile();
            }
        }
    }, [])

    const logout = useAuthStore.useLogout();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        removeToken();
        router.push("/login");
    };
    
    return (
        <main>
      <section>
        <div className="flex justify-center md:hidden">
          <Typography variant="h4" className="text-primary-1">Detail Akun</Typography>
        </div>
        <Divider className="md:hidden"/>
        <div className="grid grid-cols-3 justify-center gap-10 my-5">
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">User ID</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">User ID</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Status</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Status</Typography>
          </div>
          <div className="w-full align-top">
            <Button className="mt-5" onClick={handleLogout}>
                Logout
            </Button>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Username</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Username</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Nama</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Nama</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Role</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Role</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Jenis Kelamin</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Jenis Kelamin</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Tanggal Lahir</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Tanggal Lahir</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Nomor Telepon</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Nomor Telepon</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">NIP</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">NIP</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Jabatan</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Jabatan</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Unit Kerja</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Unit Kerja</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Eselon</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Eselon</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Created At</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Created At</Typography>
          </div>
          <div className="w-full">
            <Typography variant="p1" className="text-gray-600">Updated At</Typography>
            <Typography variant="p1" className="text-primary-1 font-medium">Updated At</Typography>
          </div>
        </div>
        <div className="flex justify-center gap-5 my-5">
            <div>
                <Button variant="outline" className="mt-5">
                    Lihat Password
                </Button>
            </div>
            <div>
                <Button variant="outline" className="mt-5">
                    Perbarui Akun
                </Button>
            </div>
        
        </div>
        <Divider/>
        <div style={{ width: '100%', overflowX: 'auto' }}>
            {profiles && profiles.length > 0 ? (
                <DataTable
                columns={profileTableColumns}
                getRowId={getRowIdProfile}
                rows={profiles}  // Mengatur urutan sort (ascending, descending)
                />
            ) : (
                <Typography variant="h6" className="text-gray-500">Belum ada kunjungan</Typography>
            )}
        </div>
      </section>
    </main>
    )
}

export default DetailPage;