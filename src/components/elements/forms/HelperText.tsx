import clsxm from "@/lib/clsxm";
import Typography from "../Typography";

export default function HelperText({
  children,
  helperTextClassName,
}: {
  children: string;
  helperTextClassName?: string;
}) {
  return (
    <div className="flex space-x-1">
      <Typography
        variant="p3"
        className={clsxm("leading-tight text-gray-500", helperTextClassName)}
      >
        {children}
      </Typography>
    </div>
  );
}
