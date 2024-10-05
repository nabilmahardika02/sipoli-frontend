import Typography from "@/components/elements/Typography";
import Forbidden from "@/components/fragments/Forbidden";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import { Profile } from "@/types/entities/profile";
import { useEffect, useState } from "react";

const PasienPage = () => {
    const { setTitle } = useDocumentTitle();
    const [pasien, setPasien] = useState<Profile>();

    if (!checkRole(["OPERATOR", "PERAWAT"])) {
        return <Forbidden/>;
    }

    useEffect(() => {
        setTitle("Detail Pasien");
    }, [setTitle]);

    useEff

  return 
    <main>
        <Typography>{pasien?.name}</Typography>
    </main>;
};
