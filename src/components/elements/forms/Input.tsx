import { useState } from "react";
import { get, RegisterOptions, useFormContext } from "react-hook-form";
import { IconType } from "react-icons";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Typography from "../Typography";
import ErrorMessage from "./ErrorMessage";
import HelperText from "./HelperText";

import clsxm from "@/lib/clsxm";

export type InputProps = {
  id: string;
  value?: string;
  label?: string;
  labelClassName?: string;
  helperText?: string;
  helperTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  prefix?: string;
  suffix?: string;
  leftIcon?: IconType;
  rightIcon?: IconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
} & React.ComponentPropsWithoutRef<"input">;

export default function Input({
  id,
  value,
  label,
  labelClassName,
  helperText,
  hideError = false,
  validation,
  className,
  type = "text",
  readOnly = false,
  prefix,
  suffix,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftIconClassName,
  rightIconClassName,
  helperTextClassName,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  return (
    <div className="w-full space-y-1.5 rounded-md">
      {label && (
        <label htmlFor={id} className="flex items-center space-x-1">
          <Typography
            font="inter"
            variant="p2"
            weight="medium"
            className={labelClassName}
          >
            {label}
          </Typography>
          {validation?.required && (
            <Typography className="text-danger-core">*</Typography>
          )}
        </label>
      )}

      <div
        className={clsxm("group relative flex w-full rounded-md", className)}
      >
        <div
          className={clsxm(
            "pointer-events-none absolute h-full w-full rounded-md ring-1 ring-inset ring-gray-300 group-focus:ring-blue-500"
          )}
        />

        {prefix && (
          <Typography
            variant="p3"
            weight="medium"
            className="flex items-center rounded-l-md bg-gray-100 px-3"
          >
            {prefix}
          </Typography>
        )}

        <div
          className={clsxm(
            "relative w-full rounded-md focus:ring-blue-500 active:ring-blue-500"
          )}
        >
          {LeftIcon && (
            <div
              className={clsxm(
                "absolute left-0 top-0 h-full",
                "flex items-center justify-center pl-2.5",
                "text-lg text-gray-400 md:text-xl",
                leftIconClassName
              )}
            >
              <LeftIcon />
            </div>
          )}

          <input
            {...register(id, validation)}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            id={id}
            name={id}
            readOnly={readOnly}
            disabled={readOnly}
            value={value}
            className={clsxm(
              "h-full w-full rounded-md px-3 py-3",
              [LeftIcon && "pl-9", RightIcon && "pr-9"],
              "bg-transparent text-sm",
              "focus:ring-blue-500 focus:ring-1 focus:outline-none",
              readOnly && "cursor-not-allowed bg-gray-200",
              prefix && "rounded-l-none rounded-r-md",
              suffix && "rounded-l-md rounded-r-none",
              prefix && suffix && "rounded-none"
            )}
            aria-describedby={id}
            {...rest}
          />

          {RightIcon && type !== "password" && (
            <div
              className={clsxm(
                "absolute bottom-0 right-0 h-full",
                "flex items-center justify-center pr-2.5",
                "text-lg text-gray-400 md:text-xl",
                rightIconClassName
              )}
            >
              <RightIcon />
            </div>
          )}

          {type === "password" && (
            <div
              className={clsxm(
                "absolute bottom-0 right-0 h-full",
                "flex items-center justify-center pr-3",
                "text-lg text-gray-400 md:text-xl",
                rightIconClassName
              )}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </div>
          )}
        </div>

        {suffix && (
          <Typography
            variant="p3"
            weight="medium"
            className="flex items-center rounded-r-md bg-gray-100 px-3"
          >
            {suffix}
          </Typography>
        )}
      </div>
      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {!error && helperText && (
        <HelperText helperTextClassName={helperTextClassName}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
}
