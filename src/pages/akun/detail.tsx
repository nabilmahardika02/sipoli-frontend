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
                "auth/all"
            );
            if (isSuccess) {
                setAccount(responseData as Account);
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
        <main className="w-full flex flex-col items-center justify-center gap-5">
            <head>
                <title>
                    SIPOLI
                </title>
            </head>

            <Typography variant="h6">
                Detail Akun
            </Typography>
            
        </main>
    )
}

export default withAuth(DetailPage, "user");