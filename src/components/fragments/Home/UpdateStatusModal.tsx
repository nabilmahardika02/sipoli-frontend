import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import clsxm from "@/lib/clsxm";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { Dispatch, SetStateAction, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const UpdateStatusModal = ({
  setShowModal,
  kunjungan,
  setTrigger,
  trigger,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  kunjungan: Kunjungan;
  setTrigger: Dispatch<SetStateAction<boolean>>;
  trigger: boolean;
}) => {
  const [btnDoneHover, setBtnDoneHover] = useState(false);
  const [btnMidClicked, setBtnMidClicked] = useState(false);
  const [btnDoneClicked, setBtnDoneClicked] = useState(false);

  const onSubmit = () => {
    let updatedStatus;
    if (btnDoneClicked) {
      updatedStatus = 2;
    } else if (btnMidClicked) {
      updatedStatus = 1;
    } else {
      updatedStatus = kunjungan.status;
    }

    console.log(updatedStatus);

    const fetchKunjungans = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "kunjungan/update-status",
        {
            idKunjungan: kunjungan.id,
            newStatus: updatedStatus
        },
        true
      );

      if (isSuccess) {
        setTrigger(!trigger);
        setShowModal(false);
      }
    };

    fetchKunjungans();
  };

  return (
    <ModalLayout setShowModal={setShowModal}>
      <div className="bg-white rounded-xl p-5 w-full md:min-w-[50%] max-w-[90%] lg:max-w-[50%] flex flex-col">
        <Typography variant="h7" className="text-center mx-auto" font="ubuntu">
          Perbarui Status Kunjungan
        </Typography>
        <Typography
          variant="p1"
          className="text-center mx-auto mt-1"
          weight="medium"
        >
          {kunjungan.profile.name}
        </Typography>
        <div className="mt-4 rounded-xl p-5 border border-gray-300 flex flex-col md:flex-row items-center justify-between gap-1">
          <button
            className={clsxm(
              "btn-update-status bg-red-500 hover:cursor-not-allowed pointer-events-none"
            )}
          >
            Belum Dilayani
          </button>
          <FaAngleDown className="text-2xl opacity-60 md:hidden" />
          <FaAngleRight className="text-2xl opacity-60 max-md:hidden" />
          <button
            className={clsxm(
              "btn-update-status",
              kunjungan.status >= 1
                ? "bg-blue-500 pointer-events-none"
                : "bg-blue-300 hover:bg-blue-500 active:outline active:outline-blue-500",
              (btnDoneHover || btnMidClicked || btnDoneClicked) && "bg-blue-500"
            )}
            onClick={() => {
              if (kunjungan.status < 1) {
                if (btnDoneClicked) {
                  setBtnDoneClicked(false);
                  setBtnMidClicked(true);
                } else {
                  setBtnMidClicked(!btnMidClicked);
                }
              }
            }}
          >
            Sedang Dilayani
          </button>
          <FaAngleDown className="text-2xl opacity-60 md:hidden" />
          <FaAngleRight className="text-2xl opacity-60 max-md:hidden" />
          <button
            className={clsxm(
              "btn-update-status",
              kunjungan.status >= 2
                ? "bg-green-500"
                : "bg-green-300 hover:bg-green-500 active:outline active:outline-green-500",
              btnDoneClicked && "bg-green-500"
            )}
            onMouseEnter={() => setBtnDoneHover(true)}
            onMouseLeave={() => setBtnDoneHover(false)}
            onClick={() => {
              setBtnDoneClicked(!btnDoneClicked);
              setBtnMidClicked(true);
            }}
          >
            Selesai
          </button>
        </div>
        <div className="flex items-center gap-2 justify-center mt-4">
          <Button
            variant="danger"
            fullRounded
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button fullRounded onClick={onSubmit}>
            Simpan
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default UpdateStatusModal;
