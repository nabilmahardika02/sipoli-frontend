import Typography from "@/components/elements/Typography";
import Image from "next/image";

const NoDataState = ({
  msg = "Tidak ada data pada opsi yang dipilih",
}: {
  msg?: string;
}) => {
  return (
    <div className="w-full p-10 flex flex-col gap-3 items-center justify-center border border-gray-300 rounded-xl">
      <Image src={"/images/folder.png"} alt="Logo" width={100} height={100} />
      <Typography variant="p1" className="text-gray-300 font-semibold">
        {msg}
      </Typography>
    </div>
  );
};

export default NoDataState;
