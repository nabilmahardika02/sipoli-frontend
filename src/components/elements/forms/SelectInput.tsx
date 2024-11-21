import * as React from "react";
import { get, RegisterOptions, useFormContext } from "react-hook-form";
import Typography from "../Typography";
import ErrorMessage from "./ErrorMessage";
import HelperText from "./HelperText";

import clsxm from "@/lib/clsxm";

export type SelectInputProps = {
  id: string;
  label?: string;
  labelClassName?: string;
  labelDirection?: string;
  helperText?: string;
  helperTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  readOnly?: boolean;
  placeholder?: string;
  parentClassName?: string;
} & React.ComponentPropsWithoutRef<"select">;

export default function SelectInput({
  id,
  label,
  labelDirection,
  helperText,
  helperTextClassName,
  hideError = false,
  validation,
  className,
  readOnly = false,
  defaultValue = "",
  placeholder = "",
  labelClassName,
  children,
  parentClassName = "",
  ...rest
}: SelectInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  return (
    <div className={clsxm("w-full space-y-1.5 rounded-md", parentClassName)}>
      <div
        className={clsxm(
          labelDirection === "horizontal" && "md:flex md:items-center gap-2"
        )}
      >
        {label && (
          <label htmlFor={id} className="flex space-x-1 items-center">
            <Typography
              font="inter"
              variant="p2"
              weight="medium"
              color="slate"
              className={labelClassName}
            >
              {label}
            </Typography>
            {validation?.required && <Typography color="danger">*</Typography>}
          </label>
        )}

        <select
          {...register(id, validation)}
          id={id}
          name={id}
          defaultValue={defaultValue}
          disabled={readOnly}
          className={clsxm(
            "w-full pl-3 pr-8 py-2.5 truncate rounded-md border-none mt-1 bg-transparent",
            "focus:ring-inset focus:ring-theme-primary-main ring-1 ring-inset ring-gray-300 focus:outline-blue-500 focus:outline-1",
            readOnly && "cursor-not-allowed",
            className
          )}
          aria-describedby={id}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
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
