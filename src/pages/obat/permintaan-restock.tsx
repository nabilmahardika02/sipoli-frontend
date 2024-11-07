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
import { RestockObatResponse } from "@/types/entities/obat";
import { pendingRestockColumn } from "@/types/table/obatColumn";
import { GridColDef } from "@mui/x-data-grid";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const RestockRequestPage = () => {
  const { setTitle } = useDocumentTitle();
  const user = useAuthStore.useUser();
  const router = useRouter();

  const [listRestock, setListRestock] = useState<RestockObatResponse[]>();
  const [listRejected, setListRejected] = useState<RestockObatResponse[]>();
  const [rejectModal, setRejectModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);

  const [trigger, setTrigger] = useState(false);
  const [rejectId, setRejectId] = useState<string>();
  const [approveId, setApproveId] = useState<string>();

  useEffect(() => {
    setTitle("Persetujuan Restock Obat");
  }, [setTitle]);

  if (!checkRole(["OPERATOR", "DOKTER", "PERAWAT"])) {
    router.push("/403");
  }

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/restock/pending"
      );

      if (isSuccess) {
        setListRestock(responseData as RestockObatResponse[]);
      }
    };

    fetchData();
  }, [trigger]);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/restock/rejected"
      );

      if (isSuccess) {
        setListRejected(responseData as RestockObatResponse[]);
      }
    };

    fetchData();
  }, [trigger]);

  const approveRestock = async (isApproveParam: boolean) => {
    const [responseData, message, isSuccess] = await sendRequest(
      "put",
      "obat/approve-restock",
      {
        idRestock: isApproveParam ? approveId : rejectId,
        isApprove: isApproveParam,
      },
      true
    );

    if (isSuccess) {
      setRejectModal(false);
      setApproveModal(false);
      setTrigger(!trigger);
    }
  };

  const adminColumns: GridColDef[] = [
    ...pendingRestockColumn,
    {
      field: "action",
      headerName: "Aksi",
      headerAlign: "center",
      width: 120,
      align: "center",
      sortable: false,
      renderCell: (value) => (
        <div className="w-full flex items-center gap-2 justify-center h-full">
          <IconButton
            icon={FaCheck}
            onClick={() => handleApprove(value.row.id)}
            variant="success"
          />
          <IconButton
            icon={IoClose}
            onClick={() => handleReject(value.row.id)}
            variant="danger"
          />
        </div>
      ),
    },
  ];

  const handleReject = (id: string) => {
    setRejectModal(true);
    setRejectId(id);
  };

  const handleApprove = (id: string) => {
    setApproveModal(true);
    setApproveId(id);
  };

  return (
    <main className="flex flex-col gap-5">
      <Head>
        <title>Persetujuan Restock Obat</title>
      </Head>

      <section className="p-5 md:p-8 rounded-xl bg-white border border-gray-200 shadow-md">
        <Typography variant="h4" className="mb-2 md:hidden text-primary-1">
          Persetujuan Restock Obat
        </Typography>

        <section className="mt-5 datatable-sm">
          {listRestock && user ? (
            <DataTable
              columns={
                user.role === "OPERATOR" ? adminColumns : pendingRestockColumn
              }
              rows={listRestock}
              flexColumnIndexes={[0]}
            />
          ) : (
            <LoadingDiv />
          )}
        </section>
      </section>

      <section className="p-5 md:p-8 rounded-xl bg-white border border-gray-200 shadow-md">
        <div className="mt-5 flex items-center gap-2">
          <div className="w-1 h-5 bg-primary-1"></div>
          <Typography className="text-primary-1 font-semibold">
            Rejected Requests
          </Typography>
        </div>

        <section className="mt-5 datatable-sm">
          {listRejected ? (
            <DataTable
              columns={pendingRestockColumn}
              rows={listRejected}
              flexColumnIndexes={[0]}
            />
          ) : (
            <LoadingDiv />
          )}
        </section>
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
              Yakin ingin menolak permintaan restock ini?
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => approveRestock(false)}
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
              Setujui data restock ini?
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button size="sm" onClick={() => approveRestock(true)}>
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

export default withAuth(RestockRequestPage, "user");
