import Button from "@/components/elements/Button";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { Profile } from "@/types/entities/profile";
import {
  getRowIdPasiens,
  pasienTableColumns,
} from "@/types/table/pasienColumn";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";

const PasienAllPage = () => {
  const { setTitle } = useDocumentTitle();
  const [users, setUsers] = useState<Account[]>();
  const [patients, setPatients] = useState<Profile[]>();

  useEffect(() => {
    setTitle("Daftar Pasien");
  }, [setTitle]);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/users?role=PASIEN"
      );

      if (isSuccess) {
        setUsers(responseData as Account[]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getAllProfiles = (accounts: Account[]): Profile[] => {
      return accounts.reduce((allProfiles: Profile[], account: Account) => {
        return [...allProfiles, ...account.listProfile];
      }, []);
    };

    if (users && users.length > 0) {
      const allProfiles = getAllProfiles(users);
      setPatients(allProfiles);
    }
  }, [users]);

  return (
    <main>
      <Head>
        <title>Daftar Pasien</title>
      </Head>
      <div className="w-full flex items-center justify-between md:justify-end gap-4">
        <Typography variant="h4" className="md:hidden">
          Daftar Pasien
        </Typography>
        <Link href={"/pasien/tambah"}>
          <Button leftIcon={GoPlus}>Tambah Pasien</Button>
        </Link>
      </div>
      <section className="mt-5">
        {users && patients ? (
          <DataTable
            columns={pasienTableColumns}
            getRowId={getRowIdPasiens}
            rows={patients}
            flexColumnIndexes={[0, 3]}
          />
        ) : (
          <LoadingDiv />
        )}
      </section>
    </main>
  );
};

export default withAuth(PasienAllPage, "PERAWAT");
