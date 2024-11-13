import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import { LoadingDiv } from "@/components/elements/Loading";
import { showToast, SUCCESS_TOAST } from "@/components/elements/Toast";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import DataTable from "@/lib/datatable";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import {
  getRowIdKunjungans,
  kunjunganTableColumns,
} from "@/types/table/antrianColumn";
import { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";

const HomeNonPasienView = () => {
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelId, setCancelId] = useState<string>();
  const router = useRouter();

  const handleOpenModal = (id: string) => {
    setShowCancelModal(true);
    setCancelId(id);
  };

  const columns: GridColDef[] = [
    ...kunjunganTableColumns,
    {
      field: "action",
      headerName: "Aksi",
      headerAlign: "center",
      width: 200,
      align: "center",
      sortable: false,
      renderCell: (value) => (
        <div className="w-full flex items-center gap-2 justify-center h-full">
          <Link href={`/kunjungan/${value.row.id}`}>
            <Button variant="outline" size="sm" fullRounded>
              Detail
            </Button>
          </Link>
          {value.row.status === 0 && (<Link href={"/home"}>
            <Button
              fullRounded
              size="base"
              variant="danger"
              onClick={() => handleOpenModal(value.row.id)}
            >
              Cancel
            </Button>
          </Link>)}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchKunjungans = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/all?isActive=true"
      );

      if (isSuccess) {
        setKunjungans(responseData as Kunjungan[]);
      }
    };

    fetchKunjungans();
  }, []);

  const cancelKunjungan = async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "put",
      "kunjungan/cancel?kunjunganId=" + cancelId,
      true
    );

    if (isSuccess) {
      router.push(`/`);
      showToast("Berhasil membatalkan kunjungan", SUCCESS_TOAST);
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-5">
        <Typography variant="h6" className="text-primary-1">
          Daftar Antrian
        </Typography>
        <div className="flex justify-end">
          <Link href={"/kunjungan/add"}>
            <Button leftIcon={GoPlus} leftIconClassName="max-md:mr-0">
              <span className="max-md:hidden">Tambah Kunjungan</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full">
        {kunjungans ? (
          kunjungans.length > 0 ? (
            <DataTable
              columns={columns}
              getRowId={getRowIdKunjungans}
              rows={kunjungans}
              flexColumnIndexes={[3, 5]}
            />
          ) : (
            <div className="w-full py-10 px-5 rounded-lg border border-gray-300 flex items-center justify-center">
              <Typography
                variant="p1"
                weight="semibold"
                className="text-gray-400"
              >
                Belum ada Antrian
              </Typography>
            </div>
          )
        ) : (
          <LoadingDiv />
        )}
      </div>

      {showCancelModal && (
        <ModalLayout setShowModal={setShowCancelModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
            <Typography variant="h6" className="text-primary-1">
              Batalkan Kunjungan
            </Typography>
            <Divider className="my-2" weight="kurus" />
            <Typography
              variant="p2"
              weight="semibold"
              className="text-secondary-4"
            >
              Yakin ingin membatalkan kunjungan ini?
            </Typography>
            <Typography variant="p2" className="text-primary-1 mt-2">
              <ul className="list-disc pl-4">
                <li>
                  Kunjungan yang sudah dibatalkan tidak dapat dibuka kembali.
                </li>
                <li>
                  Anda tidak dapat melihat informasi kunjungan yang telah
                  dibatalkan.
                </li>
              </ul>
            </Typography>
            <div className="flex items-center gap-2 mt-4 self-end">
              <Button variant="danger" size="sm" onClick={() => cancelKunjungan()}>
                Batalkan Kunjungan
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowCancelModal(false)}
              >
                Tidak
              </Button>
            </div>
          </div>
        </ModalLayout>
      )}
    </section>
  );
};

export default HomeNonPasienView;
