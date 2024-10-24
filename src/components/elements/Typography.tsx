import clsxm from "@/lib/clsxm";

import { Inter, Josefin_Sans, Ubuntu } from "next/font/google";

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
export const josefins = Josefin_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

enum TypographyVariant {
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "h7",
  "p1",
  "p2",
  "p3",
  "p4",
}

export enum FontVariant {
  "ubuntu",
  "inter",
  "josefins",
}

enum FontWeight {
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
}

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  weight?: keyof typeof FontWeight;
  font?: keyof typeof FontVariant;
  variant?: keyof typeof TypographyVariant;
  children: React.ReactNode;
};

export default function Typography<T extends React.ElementType>({
  as,
  children,
  className,
  weight = "normal",
  variant = "p1",
  font = "inter",
  ...props
}: TypographyProps<T> &
  Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
  const Component = as || "p";

  return (
    <Component
      className={clsxm(
        "text-slate-800 w-fit",
        // *=============== Font Type ==================
        [
          [font === "inter" && [inter.className]],
          [font === "ubuntu" && [ubuntu.className]],
          [font === "josefins" && [josefins.className]],
        ],
        // *=============== Font Weight ==================
        [
          [weight === "light" && ["font-light"]],
          [weight === "normal" && ["font-normal"]],
          [weight === "medium" && ["font-medium"]],
          [weight === "semibold" && ["font-semibold"]],
          [weight === "bold" && ["font-bold"]],
        ],
        // *=============== Font Variants ==================
        [
          variant === "h1" && [
            "text-[42px] font-bold leading-normal md:text-[64px] md:leading-tight",
          ],
          variant === "h2" && [
            "text-[32px] font-bold leading-normal md:text-[48px] md:leading-tight",
          ],
          variant === "h3" && [
            "text-[28px] font-bold leading-normal md:text-[40px] md:leading-tight",
          ],
          variant === "h4" && [
            "text-[22px] font-bold leading-normal md:text-[32px] md:leading-tight",
          ],
          variant === "h5" && [
            "text-[18px] font-bold leading-normal md:text-[28px] md:leading-tight",
          ],
          variant === "h6" && [
            "text-[16px] font-bold leading-normal md:text-[24px] md:leading-tight",
          ],
          variant === "h7" && [
            "text-[14px] font-bold leading-normal md:text-[20px] md:leading-tight",
          ],
          variant === "p1" && ["text-[16px] leading-normal md:leading-relaxed"],
          variant === "p2" && ["text-[14px] leading-normal md:leading-relaxed"],
          variant === "p3" && ["text-[12px] leading-normal md:leading-relaxed"],
          variant === "p4" && ["text-[10px] leading-normal md:leading-relaxed"],
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
