import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import ModalLayout from "@/components/layouts/ModalLayout";
import { formatDateOnly } from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore"; // supaya pasien & admin gak bisa edit
import { Rujukan } from "@/types/entities/kunjungan";
import { UpdateRujukanForm } from "@/types/forms/hasilPemeriksaanForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";

const DataRujukan = ({
  data,
  idPemeriksaan,
  trigger,
  setTrigger
}: {
  data: Rujukan,
  idPemeriksaan: string,
  trigger: boolean,
  setTrigger: Dispatch<SetStateAction<boolean>>
}) => {
  const user = useAuthStore.useUser(); // supaya pasien & admin gak bisa edit
  const [showModal, setShowModal] = useState(false);

  const methods = useForm<UpdateRujukanForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateRujukanForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `hasil-pemeriksaan/${idPemeriksaan}/rujukan`,
        data,
        true
      );

      if (isSuccess) {
        setShowModal(false);
        methods.reset();
        setTrigger(!trigger);
      }
    };

    postData();
  };

  useEffect(() => {
    if (data) {
      methods.setValue("dokterRujukan", data.tujuan);
      methods.setValue("tujuanRujukan", data.dokter);
      methods.setValue("catatanRujukan", data.catatan);
    }
  }, [data, methods]);

  return (
    <div>
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-primary-1"></div>
        <Typography className="text-primary-1 font-semibold">
          Rujukan
        </Typography>
        {["DOKTER", "PERAWAT"].includes(user?.role) && ( // supaya pasien & admin gak bisa edit
          <IconButton
            icon={LuPencil}
            variant="primary"
            onClick={() => setShowModal(true)}
          />
        )}
      </div>
      {data?.dokter || data?.catatan || data?.maksimalBerlaku || data?.tujuan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Tujuan Rujukan
            </Typography>
            <Typography className="text-primary-1">
              {data.tujuan || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Dokter Tujuan
            </Typography>
            <Typography className="text-primary-1">
              {data.dokter || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Catatan
            </Typography>
            <Typography className="text-primary-1">
              {data.catatan || "-"}
            </Typography>
          </div>
          {/* <div>
            <Typography variant="p2" weight="semibold" className="text-gray-400">
              Maksimal Berlaku
            </Typography>
            <Typography className="text-primary-1">
              {formatDateOnly(data.maksimalBerlaku) || "-"}
            </Typography>
          </div> */}
        </div>
      ) : (
        <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
          <Typography className="text-gray-400 font-medium">
            Pasien tidak membutuhkan rujukan
          </Typography>
        </div>
      )}

      {/* Modal Form Ubah Data Rujukan */}
      {showModal && (
        <ModalLayout setShowModal={setShowModal}>
          <div className="bg-white rounded-xl p-5 w-full md:w-[80%]">
            <Typography variant="h6" className="text-primary-1">
              Ubah Data Rujukan
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                <Input id="dokterRujukan" placeholder="Dokter Rujukan" label="Dokter Rujukan" />
                <Input id="tujuanRujukan" placeholder="Tujuan Rujukan" label="Tujuan Rujukan" />
                <Input id="catatanRujukan" placeholder="Catatan" label="Catatan" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </Button>
                  <Button type="submit">
                    Simpan
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default DataRujukan;


// import Typography from "@/components/elements/Typography";
// import { formatDateOnly } from "@/lib/formater";
// import { Rujukan } from "@/types/entities/kunjungan";

// const DataRujukan = ({ data }: { data: Rujukan }) => {
//   console.log(data + "rujukan nih");
//   return (
//     <div>
//       <div className="mt-5 flex items-center gap-2">
//         <div className="w-1 h-5 bg-primary-1"></div>
//         <Typography className="text-primary-1 font-semibold">
//           Rujukan
//         </Typography>
//       </div>
//       {data?.dokter || data?.catatan || data?.maksimalBerlaku || data?.tujuan ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//           <div>
//             <Typography
//               variant="p2"
//               weight="semibold"
//               className="text-gray-400"
//             >
//               Dokter Tujuan
//             </Typography>
//             <Typography className="text-primary-1">
//               {data.dokter || "-"}
//             </Typography>
//           </div>
//           <div>
//             <Typography
//               variant="p2"
//               weight="semibold"
//               className="text-gray-400"
//             >
//               Tujuan Rujukan
//             </Typography>
//             <Typography className="text-primary-1">
//               {data.tujuan || "-"}
//             </Typography>
//           </div>
//           <div>
//             <Typography
//               variant="p2"
//               weight="semibold"
//               className="text-gray-400"
//             >
//               Catatan
//             </Typography>
//             <Typography className="text-primary-1">
//               {data.catatan || "-"}
//             </Typography>
//           </div>
//           <div>
//             <Typography
//               variant="p2"
//               weight="semibold"
//               className="text-gray-400"
//             >
//               Maksimal Berlaku
//             </Typography>
//             <Typography className="text-primary-1">
//               {formatDateOnly(data.maksimalBerlaku) || "-"}
//             </Typography>
//           </div>
//         </div>
//       ) : (
//         <div className="w-full flex justify-center rounded-lg border border-gray-300 py-8 mt-3">
//           <Typography className="text-gray-400 font-medium">
//             Pasien tidak membutuhkan rujukan
//           </Typography>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataRujukan;
