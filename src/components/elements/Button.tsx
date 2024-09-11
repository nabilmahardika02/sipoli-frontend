import * as React from "react";
import { IconType } from "react-icons";

import clsxm from "@/lib/clsxm";
import Typography from "./Typography";

enum ButtonVariant {
  "primary",
  "dark",
  "outline",
  "danger"
}

enum ButtonSize {
  "sm",
  "base",
  "lg",
}

export type ButtonProps = {
  size?: keyof typeof ButtonSize;
  variant?: keyof typeof ButtonVariant;
  leftIcon?: IconType;
  rightIcon?: IconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
  textClassName?: string;
  fullRounded?: boolean;
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      fullRounded = true,
      size = "base",
      variant = "primary",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
      textClassName,
      ...rest
    },
    ref
  ) => {
    const disabled = buttonDisabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={clsxm(
          fullRounded ? "rounded-full" : "rounded-lg",
          "button group flex items-center justify-center text-center",
          //*=========== Size ===========
          [
            size === "lg" && ["px-3 py-2 md:px-6 md:py-[8px]"],
            size === "base" && ["px-2.5 py-1 md:px-5 md:py-[6px]"],
            size === "sm" && [" px-2 py-[3px] md:px-4 md:py-[4px]"],
          ],
          //*=========== Variants ===========
          [
            variant === "primary" && [
              "bg-secondary hover:bg-primary active:bg-slate-700 active:ring-1 active:ring-primary ",
            ],
            variant === "dark" && [
              "bg-eerie hover:bg-licorice active:bg-dark active:ring-1 active:ring-primary",
            ],
            variant === "danger" && [
              "bg-red-400 hover:bg-red-500 active:bg-red-600 active:ring-1 active:ring-red-200",
            ],
            variant === "outline" && [
              "border-2 border-primary bg-transparent hover:bg-primary active:bg-slate-700",
            ],
          ],
          //#endregion  //*======== Variants ===========
          "disabled:cursor-not-allowed disabled:bg-opacity-70",
          className
        )}
        {...rest}
      >
        {/* content */}
        {/* Left Icon */}
        {LeftIcon && (
          <div
            className={clsxm([
              size === "sm" && "mr-[10px] text-lg",
              size === "base" && "mr-[8px] text-xl",
              size === "lg" && "mr-[8px] text-xl",
              variant === "outline"
                ? "text-primary group-hover:text-white"
                : "text-white",
            ])}
          >
            <LeftIcon className={clsxm("font-semibold", leftIconClassName)} />
          </div>
        )}
        <Typography
          className={clsxm(
            textClassName,
            variant === "outline" && "text-primary group-hover:text-white"
          )}
          variant={size === "sm" ? "p3" : "p2"}
          color="white"
          weight="medium"
          font="ubuntu"
        >
          {children}
        </Typography>
        {RightIcon && (
          <div
            className={clsxm([
              size === "sm" && "ml-[10px]",
              size === "base" && "ml-[8px]",
              size === "lg" && "ml-[8px]",
              variant === "outline"
                ? "text-primary group-hover:text-white"
                : "text-white",
            ])}
          >
            <RightIcon
              className={clsxm(
                "text-sm font-semibold md:text-xl",
                rightIconClassName
              )}
            />
          </div>
        )}
      </button>
    );
  }
);

export default Button;
