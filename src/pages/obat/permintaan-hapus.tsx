import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import IconButton from "@/components/elements/IconButton";
import { LoadingDiv } from "@/components/elements/Loading";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import ModalLayout from "@/components/layouts/ModalLayout";
import { useDocumentTitle } from "@/context/Title";
import { checkRole } from "@/lib/checkRole";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { Obat } from "@/types/entities/obat";
import { obatTableColumn } from "@/types/table/obatColumn";
import { GridColDef } from "@mui/x-data-grid";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const DeleteRequestPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const router = useRouter();

  const [listObat, setListObat] = useState<Obat[]>();
  const [rejectModal, setRejectModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const [selectedId, setSelectedId] = useState<string>();
  const [isApprove, setIsApprove] = useState<boolean>();

  useEffect(() => {
    setTitle("Persetujuan Hapus Obat");
  }, [setTitle]);

  if (!checkRole(["OPERATOR", "DOKTER", "PERAWAT"])) {
    router.push("/403");
  }

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/delete-request"
      );

      if (isSuccess) {
        setListObat(responseData as Obat[]);
      }
    };

    fetchData();
  }, [trigger]);

  const approveDelete = async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "put",
      `obat/delete/${selectedId}/approval?is-approve=${isApprove}`,
      null,
      true
    );

    if (isSuccess) {
      setRejectModal(false);
      setApproveModal(false);
      setTrigger(!trigger);
    }
  };

  const adminColumns: GridColDef[] = [
    ...obatTableColumn,
    {
      field: "approval",
      headerName: "Persetujuan",
      headerAlign: "center",
      width: 120,
      align: "center",
      sortable: false,
      renderCell: (value) => (
        <div className="w-full flex items-center gap-2 justify-center h-full">
          <IconButton
            icon={FaCheck}
            onClick={() => handleApproval(value.row.id, true)}
            variant="success"
          />
          <IconButton
            icon={IoClose}
            onClick={() => handleApproval(value.row.id, false)}
            variant="danger"
          />
        </div>
      ),
    },
  ];

  const handleApproval = (id: string, isApprove: boolean) => {
    setSelectedId(id);
    setIsApprove(isApprove);
    if (isApprove) {
      setApproveModal(true);
    } else {
      setRejectModal(true);
    }
  };

  return (
    <main>
      <Head>
        <title>Persetujuan Hapus Obat</title>
      </Head>

      <Typography variant="h4" className="mb-2 md:hidden text-primary-1">
        Persetujuan Hapus Obat
      </Typography>

      <section className="mt-5">
        {listObat && user ? (
          <DataTable
            columns={user.role === "OPERATOR" ? adminColumns : obatTableColumn}
            rows={listObat}
            flexColumnIndexes={[0]}
          />
        ) : (
          <LoadingDiv />
        )}
      </section>

      {rejectModal && (
        <ModalLayout setShowModal={setRejectModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
            <Typography variant="h6" className="text-primary-1">
              Tolak Permintaan
            </Typography>
            <Divider className="my-2" weight="kurus" />
            <Typography
              variant="p2"
              weight="semibold"
              className="text-secondary-4"
            >
              Yakin ingin menolak penghapusan obat ini?
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => approveDelete()}
              >
                Ya
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setRejectModal(false)}
              >
                Tidak
              </Button>
            </div>
          </div>
        </ModalLayout>
      )}
      {approveModal && (
        <ModalLayout setShowModal={setApproveModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
            <Typography variant="h6" className="text-primary-1">
              Setujui Permintaan
            </Typography>
            <Divider className="my-2" weight="kurus" />
            <Typography
              variant="p2"
              weight="semibold"
              className="text-secondary-4"
            >
              Setujui hapus obat ini?
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button size="sm" onClick={() => approveDelete()}>
                Ya
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setApproveModal(false)}
              >
                Tidak
              </Button>
            </div>
          </div>
        </ModalLayout>
      )}
    </main>
  );
};

export default withAuth(DeleteRequestPage, "user");
