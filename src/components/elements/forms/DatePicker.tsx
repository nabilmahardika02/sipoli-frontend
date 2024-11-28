import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import {
  Control,
  Controller,
  get,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import Typography from "../Typography";
import ErrorMessage from "./ErrorMessage";
import HelperText from "./HelperText";

const MyDatePicker = ({
  label,
  labelClassName,
  disableFuture = false,
  disablePast = false,
  id,
  control,
  validation,
  defaultValue,
  helperText,
}: {
  disableFuture?: boolean;
  disablePast?: boolean;
  label?: string;
  labelClassName?: string;
  id: string;
  control: Control<any>;
  validation?: RegisterOptions;
  defaultValue?: Dayjs;
  helperText?: string;
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  return (
    <div className="custom-mui-input w-full space-y-1.5 rounded-md">
      {label && (
        <label className="flex items-center space-x-1">
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
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue ? defaultValue : null}
        rules={validation}
        render={({ field }) => (
          <DatePicker
            {...field}
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            disableFuture={disableFuture}
            disablePast={disablePast}
            views={["year", "month", "day"]}
            className="w-full"
            format="DD/MM/YYYY"
          />
        )}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
};

export default MyDatePicker;
