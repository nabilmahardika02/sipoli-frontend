import clsxm from "@/lib/clsxm";
import * as React from "react";
import { useFormContext } from "react-hook-form";

import Typography from "../Typography";
import HelperText from "./HelperText";

enum CheckboxSize {
  "vs",
  "sm",
  "base",
}

export type CheckboxProps = {
  label?: string;
  name: string;
  value?: string | number;
  helperText?: string;
  readOnly?: boolean;
  labelClassName?: string;
  isChecked?: boolean;
  labelVariant?: string;
  size?: keyof typeof CheckboxSize;
} & Omit<React.ComponentPropsWithoutRef<"input">, "size">;

export default function Checkbox({
  label,
  name,
  value,
  isChecked,
  helperText,
  readOnly = false,
  size = "base",
  labelClassName,
  className,
  ...rest
}: CheckboxProps) {
  const { register } = useFormContext();

  return (
    <div className={className}>
      <div className="group flex items-start gap-2">
        <input
          {...register(name)}
          {...rest}
          type="checkbox"
          name={name}
          id={`${name}_${value}`}
          value={value}
          readOnly={readOnly}
          checked={isChecked}
          className={clsxm(
            "mt-1",
            "shrink-0",
            "rounded-sm border-2 focus:ring-0",
            "checked:accent-blue-500 group-hover:cursor-pointer",
            readOnly &&
              "checked:accent-blue-600 cursor-not-allowed group-hover:cursor-not-allowed",
            size === "vs" && "w-1 h-1",
            size === "sm" && "w-2 h-3",
            size === "base" && "h-4 w-4"
          )}
          aria-describedby={name}
        />
        <Typography
          className={clsxm(
            readOnly && "cursor-not-allowed",
            "group-hover:cursor-pointer",
            readOnly && "cursor-not-allowed group-hover:cursor-not-allowed",
            labelClassName
          )}
          as="label"
          htmlFor={`${name}_${value}`}
          variant="p2"
        >
          {label}
        </Typography>
      </div>
      <div className="mt-1">
        {helperText && <HelperText>{helperText}</HelperText>}
      </div>
    </div>
  );
}
