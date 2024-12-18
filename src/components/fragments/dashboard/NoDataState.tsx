import Typography from "@/components/elements/Typography";
import clsxm from "@/lib/clsxm";
import Image from "next/image";

const NoDataState = ({
  msg = "Tidak ada data pada opsi yang dipilih",
  img = "/images/folder.png",
  className = "",
}: {
  msg?: string;
  img?: string;
  className?: string;
}) => {
  return (
    <div
      className={clsxm(
        "w-full p-10 flex flex-col gap-3 items-center justify-center border border-gray-300 rounded-xl",
        className
      )}
    >
      <Image src={img} alt="Logo" width={120} height={120} />
      <Typography variant="p1" className="text-gray-300 font-semibold">
        {msg}
      </Typography>
    </div>
  );
};

export default NoDataState;
