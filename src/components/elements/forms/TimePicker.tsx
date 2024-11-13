import { MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
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
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  return (
    <div className="w-full space-y-1.5 rounded-md">
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
    </div>
  );
};

export default MyTimePicker;
