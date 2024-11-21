import clsxm from "@/lib/clsxm";
import { MobileTimePicker } from "@mui/x-date-pickers";
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

const MyTimePicker = ({
  label,
  labelClassName,
  disableFuture = false,
  id,
  control,
  validation,
  readonly = false,
  disabled = false,
  defaultValue,
  minuteStep = 1,
  helperText,
  className = "",
}: {
  disableFuture?: boolean;
  label?: string;
  labelClassName?: string;
  id: string;
  control: Control<any>;
  validation?: RegisterOptions;
  readonly?: boolean;
  disabled?: boolean;
  defaultValue?: Dayjs;
  minuteStep?: 1 | 5 | 10 | 15 | 20 | 30 | 60;
  helperText?: string;
  className?: string;
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  return (
    <div className={clsxm("w-full space-y-1.5 rounded-md", className)}>
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
          <MobileTimePicker
            {...field}
            value={field.value}
            readOnly={readonly}
            disabled={disabled}
            minutesStep={minuteStep}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            disableFuture={disableFuture}
            className="w-full"
          />
        )}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
};

export default MyTimePicker;
