import * as React from "react";

import clsxm from "@/lib/clsxm";
import { get, RegisterOptions, useFormContext } from "react-hook-form";
import Typography from "../Typography";
import ErrorMessage from "./ErrorMessage";
import HelperText from "./HelperText";

export type TextAreaProps = {
  id: string;
  label?: string;
  labelClassName?: string;
  validation?: RegisterOptions;
  helperText?: string;
  helperTextClassName?: string;
  hideError?: boolean;
} & React.ComponentPropsWithoutRef<"textarea">;

export default function TextArea({
  id,
  label,
  labelClassName,
  validation,
  helperText,
  helperTextClassName,
  hideError = false,
  className,
  maxLength = 255,
  readOnly = false,
  ...rest
}: TextAreaProps) {
  const [value, setValue] = React.useState("");

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);
  const textArea = register(id, validation);

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    textArea.onChange(e);
    setValue(e.currentTarget.value);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="flex space-x-1">
          <Typography
            font="inter"
            variant="p2"
            weight="medium"
            className={labelClassName}
          >
            {label}
          </Typography>
          {validation?.required && <Typography color="danger">*</Typography>}
        </label>
      )}

      <div className="relative">
        <textarea
          {...textArea}
          id={id}
          name={id}
          readOnly={readOnly}
          disabled={readOnly}
          maxLength={maxLength}
          onChange={handleChange}
          className={clsxm(
            "w-full rounded-md px-3 py-2.5",
            "border-none ring-1 ring-gray-300 focus:ring-2",
            readOnly && "cursor-not-allowed",
            className
          )}
          aria-describedby={id}
          {...rest}
        />
        <Typography
          variant="p2"
          className="text-theme-type-secondary absolute bottom-2.5 right-3"
        >
          {value.length}/{maxLength}
        </Typography>
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
