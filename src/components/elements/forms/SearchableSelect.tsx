"use client";

import { get, RegisterOptions, useFormContext } from "react-hook-form";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import Typography from "../Typography";
import ErrorMessage from "./ErrorMessage";
import HelperText from "./HelperText";

import clsxm from "@/lib/clsxm";
import { useEffect } from "react";

export type InputProps = {
  id: string;
  value?: string | null;
  label?: string;
  labelClassName?: string;
  helperText?: string;
  helperTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  onChange?: (selectedOption: any) => void;
  required?: boolean;
  options?: OptionsOrGroups<
    { value: string; label: string },
    GroupBase<{ value: string; label: string }>
  >;
  menuIsOpen?: boolean;
  openMenuOnClick?: boolean;
  closeMenuOnSelect?: boolean;
  maxHeightDropdown?: number;
} & React.ComponentPropsWithoutRef<"input">;

export default function SearchableSelect({
  id,
  value,
  label,
  labelClassName,
  required,
  helperText,
  hideError = false,
  validation,
  className,
  options,
  onChange,
  helperTextClassName,
  menuIsOpen,
  openMenuOnClick,
  closeMenuOnSelect,
  maxHeightDropdown,
}: InputProps) {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext();

  const error = get(errors, id);
  const watchedValue = watch(id);

  useEffect(() => {
    if (watchedValue === undefined) {
      setValue(id, undefined);
    }
  }, [watchedValue, setValue, id]);

  const handleSelectChange = (selectedOption: any) => {
    setValue(id, selectedOption ? selectedOption.value : undefined);
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <div className="w-full rounded-md">
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
          {validation?.required && <Typography color="danger">*</Typography>}
        </label>
      )}

      <div
        className={clsxm("group relative flex w-full rounded-md", className)}
      >
        <div
          className={clsxm(
            "relative w-full rounded-md focus:ring-blue-500 active:ring-blue-500"
          )}
        >
          <Select
            {...register(id, validation)}
            id={id}
            name={id}
            // @ts-ignore
            value={
              // @ts-ignore
              options?.find((option) => option.value === watchedValue) || null
            }
            className={clsxm(
              "mt-1 h-full w-full rounded-md",
              "bg-transparent text-sm",
              "focus:ring-1 focus:ring-primary",
              className
            )}
            onChange={handleSelectChange}
            required={required}
            options={options}
            menuIsOpen={menuIsOpen}
            openMenuOnClick={openMenuOnClick}
            closeMenuOnSelect={closeMenuOnSelect}
            maxMenuHeight={maxHeightDropdown}
          />
        </div>
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
