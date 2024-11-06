import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import { formatDateOnly } from "@/lib/formater";
import { Kunjungan } from "@/types/entities/kunjungan";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const KunjunganCard = ({
  kunjungan,
  setCancelId,
  setShowCancelModal,
}: {
  kunjungan: Kunjungan;
  setCancelId: Dispatch<SetStateAction<string | undefined>>;
  setShowCancelModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 w-full md:w-[30%] shrink-0">
      <Typography
        variant="h7"
        font="ubuntu"
        className="font-semibold mb-1 text-slate-700"
      >
        Antrian {kunjungan.antrian.noAntrian} - Sesi {kunjungan.antrian.sesi}
      </Typography>
      <Typography variant="p1" weight="medium" className="mb-2">
        {formatDateOnly(kunjungan.tanggal)}
      </Typography>
      <div className="flex justify-between gap-2 mt-4">
        {kunjungan.status === 0 && (<Link href={"/home"}>
          <Button
            fullRounded
            variant="danger"
            onClick={() => {
              setShowCancelModal(true);
              setCancelId(kunjungan.id);
            }}
          >
            Cancel
          </Button>
        </Link>)}
        <Link href={`/kunjungan/${kunjungan.id}`}>
          <Button fullRounded>
            Detail
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default KunjunganCard;
