import * as React from "react";
import { IconType } from "react-icons";

import clsxm from "@/lib/clsxm";
import Typography from "./Typography";

enum ButtonVariant {
  "primary",
  "secondary",
  "outline",
  "danger",
  "warning",
  "success",
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
      fullRounded = false,
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
          "button group flex items-center justify-center text-center w-fit h-fit",
          //*=========== Size ===========
          [
            size === "lg" && ["px-3 py-2 md:px-6 md:py-[8px]"],
            size === "base" && ["px-2.5 py-1 md:px-5 md:py-[6px]"],
            size === "sm" && [" px-2 py-[3px] md:px-4 md:py-[4px]"],
          ],
          //*=========== Variants ===========
          [
            variant === "primary" && [
              "bg-primary-1 hover:bg-primary-2 active:bg-primary-3 active:ring-1 active:ring-primary-3 ",
            ],
            variant === "secondary" && [
              "bg-secondary-1 hover:bg-secondary-2 active:bg-secondary-3 active:ring-1 active:ring-secondary-3 ",
            ],
            variant === "danger" && [
              "bg-danger-2 hover:bg-red-500 active:bg-red-600 active:ring-1 active:ring-red-600",
            ],
            variant === "warning" && [
              "bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 active:ring-1 active:ring-yellow-600",
            ],
            variant === "success" && [
              "bg-success-core hover:bg-success-2 active:bg-success-1 active:ring-1 active:ring-success-1",
            ],
            variant === "outline" && [
              "bg-transparent outline outline-primary-1 hover:bg-primary-1 active:bg-primary-2",
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
                ? "text-primary-1 group-hover:text-white"
                : "text-white",
            ])}
          >
            <LeftIcon className={clsxm("font-semibold", leftIconClassName)} />
          </div>
        )}
        <Typography
          className={clsxm(
            textClassName,
            variant === "outline"
              ? "text-primary-1 group-hover:text-white"
              : "text-white"
          )}
          variant={size === "sm" ? "p3" : "p2"}
          color="white"
          weight="medium"
          font="inter"
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
                ? "text-primary-1 group-hover:text-white"
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
