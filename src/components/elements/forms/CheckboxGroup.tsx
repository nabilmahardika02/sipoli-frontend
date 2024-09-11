import clsxm from "@/lib/clsxm";
import * as React from "react";
import Typography from "../Typography";
import Checkbox from "./Checkbox";
import HelperText from "./HelperText";

enum CheckboxSize {
  "sm",
  "base",
}

enum Direction {
  "horizontal",
  "vertical",
  "grid",
}

export type CheckboxOptionType = {
  value: string | number;
  text: string;
};

export type CheckboxGroupProps = {
  className?: string;
  options: CheckboxOptionType[];
  label?: string;
  name: string;
  helperText?: string;
  helperTextClassName?: string;
  readOnly?: boolean;
  labelClassName?: string;
  size?: keyof typeof CheckboxSize;
  direction?: keyof typeof Direction;
  directionClassName?: string;
} & Omit<React.ComponentPropsWithoutRef<"input">, "size">;

export default function CheckboxGroup({
  className,
  direction = "vertical",
  directionClassName = "",
  options,
  label,
  name,
  helperText,
  helperTextClassName,
  readOnly = false,
  size = "base",
  labelClassName,
  ...rest
}: CheckboxGroupProps) {
  return (
    <div className={clsxm("w-full space-y-1.5 rounded-md", className)}>
      {label && (
        <label htmlFor={name} className="flex space-x-1 items-center">
          <Typography
            font="inter"
            variant="p2"
            weight="medium"
            className={labelClassName}
          >
            {label}
          </Typography>
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
          <Checkbox
            key={option.value}
            value={option.value}
            label={option.text}
            name={name}
            size={size}
            readOnly={readOnly}
          />
        ))}
      </div>

      {helperText && (
        <HelperText helperTextClassName={helperTextClassName}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
}
