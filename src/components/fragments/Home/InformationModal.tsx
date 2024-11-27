import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import { Dispatch, SetStateAction } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const InformationModal = ({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <ModalLayout setShowModal={setShowModal}>
      <div className="bg-white rounded-xl p-5 w-full md:w-[50%] flex flex-col">
        <Typography variant="h7" className="text-center mx-auto" font="ubuntu">
          Status Kunjungan
        </Typography>
        <div className="mt-4 rounded-xl p-5 border border-gray-300 flex flex-col md:flex-row items-center justify-between gap-1">
          <Typography
            className="max-md:w-full bg-red-500 text-center text-white py-2 px-4 rounded-lg min-w-36"
            weight="medium"
            variant="p2"
          >
            Belum Dilayani
          </Typography>
          <FaAngleDown className="text-2xl opacity-60 md:hidden" />
          <FaAngleRight className="text-2xl opacity-60 max-md:hidden" />
          <Typography
            className="max-md:w-full bg-blue-500 text-center text-white py-2 px-4 rounded-lg min-w-36"
            weight="medium"
            variant="p2"
          >
            Sedang Dilayani
          </Typography>
          <FaAngleDown className="text-2xl opacity-60 md:hidden" />
          <FaAngleRight className="text-2xl opacity-60 max-md:hidden" />
          <Typography
            className="max-md:w-full bg-green-500 text-center text-white py-2 px-4 rounded-lg min-w-36"
            weight="medium"
            variant="p2"
          >
            Selesai
          </Typography>
        </div>
        <ul className="list-disc ml-6 mt-4">
          <li>
            <Typography variant="p2" className="text-gray-600">
              Kunjungan berstatus{" "}
              <span className="font-bold">belum dilayani</span> akan otomatis
              menjadi <span className="font-bold">dibatalkan</span> apabila pada
              pergantian tanggal belum diproses.
            </Typography>
          </li>
          <li>
            <Typography variant="p2" className="text-gray-600">
              Kunjungan berstatus{" "}
              <span className="font-bold">sedang dilayani</span> akan otomatis
              dianggap <span className="font-bold">selesai</span> pada
              pergantian tanggal.
            </Typography>
          </li>
        </ul>
      </div>
    </ModalLayout>
  );
};

export default InformationModal;
