import clsxm from "@/lib/clsxm";
import Image from "next/image";
import Typography from "./Typography";

enum ButtonSize {
  "sm",
  "base",
}

const Logo = ({
  className,
  size = "base",
  showText = false,
  sizeCustom,
}: {
  className?: string;
  size?: keyof typeof ButtonSize;
  showText?: boolean;
  sizeCustom?: number;
}) => {
  const logoSize = size === "base" ? 50 : 45;

  return (
    <div className={clsxm("w-fit flex items-center gap-2", className)}>
      <Image
        src={"/images/logo.png"}
        alt="Logo"
        width={sizeCustom ? sizeCustom : logoSize}
        height={sizeCustom ? sizeCustom : logoSize}
      />
      {showText && (
        <Typography variant="h5" className="text-white" font="ubuntu">
          SIPOLI
        </Typography>
      )}
    </div>
  );
};

export default Logo;
