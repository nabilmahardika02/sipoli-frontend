import * as React from "react";
import { IconType } from "react-icons";

import clsxm from "@/lib/clsxm";

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
  icon: IconType;
  leftIconClassName?: string;
  textClassName?: string;
  fullRounded?: boolean;
} & React.ComponentPropsWithRef<"button">;

const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      fullRounded = false,
      size = "base",
      variant = "primary",
      icon: Icon,
      leftIconClassName,
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
          "button text-center w-fit h-fit group",
          //*=========== Size ===========
          [
            size === "lg" && ["p-3 md:p-[8px]"],
            size === "base" && ["p-2 md:p-[6px]"],
            size === "sm" && ["md:p-1"],
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
        <div
          className={clsxm([
            size === "sm" && "text-md",
            size === "base" && "text-lg",
            size === "lg" && "text-xl",
            variant === "outline"
              ? "text-primary-1 group-hover:text-white"
              : "text-white",
          ])}
        >
          <Icon className={clsxm("font-semibold", leftIconClassName)} />
        </div>
      </button>
    );
  }
);

export default IconButton;
