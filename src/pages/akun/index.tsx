import Button from "@/components/elements/Button";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { Account } from "@/types/entities/account";
import { getRowIdUsers, userTableColumns } from "@/types/table/userColumn";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";

const AkunPage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Daftar Akun");
  }, [setTitle]);

  const [users, setUsers] = useState<Account[]>();

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "auth/users"
      );

      if (isSuccess) {
        setUsers(responseData as Account[]);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <div className="w-full flex items-center justify-end gap-4">
        <Link href={"/akun/register"}>
          <Button leftIcon={GoPlus}>Tambah</Button>
        </Link>
      </div>
      <section className="mt-5">
        {users && (
          <DataTable
            columns={userTableColumns}
            getRowId={getRowIdUsers}
            rows={users}
          />
        )}
      </section>
    </main>
  );
};

export default withAuth(AkunPage, "OPERATOR");
