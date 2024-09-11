import clsxm from "@/lib/clsxm";

enum DividerWeight {
  "kurus",
  "thin",
  "base",
}

const Divider = ({
  weight = "base",
  className,
}: {
  weight?: keyof typeof DividerWeight;
  className?: string;
}) => {
  return (
    <hr
      className={clsxm(
        "my-4 border-t-0",
        [
          weight === "kurus" && "h-[0.5px] bg-neutral-400",
          weight === "thin" && "h-[1px] bg-neutral-400",
          weight === "base" && "h-0.5 bg-neutral-400",
        ],
        className
      )}
    />
  );
};

export default Divider;
