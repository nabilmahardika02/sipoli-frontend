import clsxm from "@/lib/clsxm";
import * as React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import Typography from "../Typography";
import HelperText from "./HelperText";

enum RadioButtonSize {
  "sm",
  "base",
}

enum Direction {
  "horizontal",
  "vertical",
  "grid",
}

export type RadioOptionType = {
  value: string | number;
  text: string;
};

export type RadioButtonProps = {
  className?: string;
  options: RadioOptionType[];
  label?: string;
  name: string;
  helperText?: string;
  hideError?: boolean;
  helperTextClassName?: string;
  errorClassName?: string;
  readOnly?: boolean;
  labelClassName?: string;
  size?: keyof typeof RadioButtonSize;
  direction?: keyof typeof Direction;
  directionClassName?: string;
  validation?: RegisterOptions;
  devaultValue?: string | number;
} & Omit<React.ComponentPropsWithoutRef<"input">, "size">;

export default function RadioButtonGroup({
  required = false,
  className,
  direction = "vertical",
  directionClassName = "",
  options,
  label,
  name,
  helperText,
  helperTextClassName,
  errorClassName,
  readOnly = false,
  disabled = false,
  size = "base",
  labelClassName,
  validation,
  hideError = false,
  defaultValue,
  ...rest
}: RadioButtonProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={clsxm("w-full space-y-1.5 rounded-md", className)}>
      {label && (
        <label htmlFor={name} className="flex space-x-1 items-center">
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
      <div
        className={clsxm(
          direction === "vertical" && "flex flex-col",
          direction === "horizontal" && "flex flex-wrap gap-10",
          direction === "grid" && "grid grid-cols-3 md:grid-cols-4",
          directionClassName
        )}
      >
        {options.map((option) => (
          <div className="flex items-center gap-2 group" key={option.value}>
            <input
              {...register(name, validation)}
              {...rest}
              type="radio"
              value={option.value}
              id={`${name}_${option.value}`}
              name={name}
              disabled={disabled}
              readOnly={readOnly}
              className={clsxm(
                "accent-blue-600 bg-gray-100 border-gray-300 ",
                "group-hover:cursor-pointer",
                readOnly && "cursor-not-allowed group-hover:cursor-not-allowed",
                [size === "sm" && "w-3 h-3", size === "base" && "w-4 h-4"]
              )}
              defaultChecked={option.value === defaultValue}
            />
            <Typography
              className={clsxm(
                readOnly && "cursor-not-allowed",
                "group-hover:cursor-pointer",
                readOnly && "cursor-not-allowed group-hover:cursor-not-allowed",
                labelClassName
              )}
              as="label"
              htmlFor={`${name}_${option.value}`}
              variant="p2"
            >
              {option.text}
            </Typography>
          </div>
        ))}
      </div>

      {error && !hideError && (
        <Typography
          variant="p3"
          className={clsxm(
            "!leading-tight text-danger-core",
            errorClassName
          )}
        >
          {error?.message?.toString()}
        </Typography>
      )}
      {helperText && (
        <HelperText helperTextClassName={helperTextClassName}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
}
