import clsxm from "@/lib/clsxm";

import { Inter, Josefin_Sans, Ubuntu } from "next/font/google";

export const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
export const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
export const josefins = Josefin_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

enum TypographyVariant {
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p1",
  "p2",
  "p3",
  "p4",
}

export enum TypographyColor {
  "primary",
  "secondary",
  "ternary",
  "warning",
  "danger",
  "white",
}

export enum FontVariant {
  "ubuntu",
  "inter",
  "josefins",
}

enum FontWeight {
  "light",
  "regular",
  "medium",
  "semibold",
  "bold",
}

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  weight?: keyof typeof FontWeight;
  color?: keyof typeof TypographyColor;
  font?: keyof typeof FontVariant;
  variant?: keyof typeof TypographyVariant;
  children: React.ReactNode;
};

export default function Typography<T extends React.ElementType>({
  as,
  children,
  className,
  weight = "medium",
  variant = "p1",
  font = "inter",
  color = "primary",
  ...props
}: TypographyProps<T> &
  Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
  const Component = as || "p";

  return (
    <Component
      className={clsxm(
        // *=============== Font Type ==================
        [
          [font === "inter" && [inter.className]],
          [font === "ubuntu" && [ubuntu.className]],
          [font === "josefins" && [josefins.className]],
        ],
        // *=============== Font Weight ==================
        [
          [weight === "light" && ["font-light"]],
          [weight === "regular" && ["font-regular"]],
          [weight === "medium" && ["font-medium"]],
          [weight === "semibold" && ["font-semibold"]],
          [weight === "bold" && ["font-bold"]],
        ],
        // *=============== Font Variants ==================
        [
          variant === "h1" && [
            "text-[40px] font-bold leading-normal md:text-[96px] md:leading-tight",
          ],
          variant === "h2" && [
            "text-[30px] font-bold leading-normal md:text-[60px] md:leading-tight",
          ],
          variant === "h3" && [
            "text-[28px] font-bold leading-normal md:text-[48px] md:leading-tight",
          ],
          variant === "h4" && [
            "text-[24px] font-bold leading-normal md:text-[34px] md:leading-tight",
          ],
          variant === "h5" && [
            "text-[18px] font-bold leading-normal md:text-[24px] md:leading-tight",
          ],
          variant === "h6" && [
            "text-[14px] font-bold leading-normal md:text-[20px] md:leading-tight",
          ],
          variant === "p1" && ["text-[16px] leading-normal md:leading-relaxed"],
          variant === "p2" && ["text-[14px] leading-normal md:leading-relaxed"],
          variant === "p3" && ["text-[12px] leading-normal md:leading-relaxed"],
          variant === "p4" && ["text-[10px] md:leading-[12px]"],
        ],
        // *=============== Font Color ==================
        [color === "primary" && ["text-slate-800"]],
        [color === "secondary" && ["text-slate-600"]],
        [color === "ternary" && ["text-gray-600"]],
        [color === "warning" && ["text-yellow-500"]],
        [color === "danger" && ["text-red-500"]],
        [color === "white" && ["text-white"]],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
