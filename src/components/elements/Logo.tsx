import clsxm from "@/lib/clsxm";
import Image from "next/image";

enum ButtonSize {
  "sm",
  "base",
}

const Logo = ({
  className,
  size = "base",
}: {
  className?: string;
  size?: keyof typeof ButtonSize;
}) => {
  const logoSize = size === "base" ? 50 : 45;

  return (
    <div className={clsxm("w-fit", className)}>
      <Image
        src={"/images/logo.png"}
        alt="Logo"
        width={logoSize}
        height={logoSize}
      />
    </div>
  );
};

export default Logo;
