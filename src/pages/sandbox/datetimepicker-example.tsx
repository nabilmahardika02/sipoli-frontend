import Button from "@/components/elements/Button";
import MyDatePicker from "@/components/elements/forms/DatePicker";
import MyTimePicker from "@/components/elements/forms/TimePicker";
import Typography from "@/components/elements/Typography";
import { formatDateDayjs, formatTimeDayjs } from "@/lib/formater";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const DatepickerExample = () => {
  const methods = useForm<{
    date: Dayjs;
    disableFuture: Dayjs;
    next7Days: Dayjs;
    time: Dayjs;
  }>({
    mode: "onTouched",
  });

  const { handleSubmit, control } = methods;

  const onSubmit: SubmitHandler<{
    date: Dayjs;
    disableFuture: Dayjs;
    next7Days: Dayjs;
    time: Dayjs;
  }> = (data) => {
    console.log(formatDateDayjs(data.disableFuture));
    console.log(formatTimeDayjs(data.time));
  };

  return (
    <main className="min-h-screen w-full p-10">
      <Link href={"/sandbox"} className="w-fit">
        <Typography
          className="text-gray-500 hover:text-blue-400 w-fit"
          weight="semibold"
        >
          Back
        </Typography>
      </Link>
      <div className="mt-2 md:w-[50%] border-2 border-primary-1 rounded-xl p-5 md:p-10">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2">
              <MyDatePicker
                id="date"
                label="Basic Datepicker"
                control={control}
                validation={{
                  required: "Date is required",
                }}
              />
            </div>
            <div className="mt-2">
              <MyDatePicker
                id="disableFuture"
                label="Disable Future"
                control={control}
                validation={{
                  required: "Date is required",
                  validate: (value) => {
                    if (!value) return true;
                    return (
                      value <= new Date() || "Date cannot be in the future"
                    );
                  },
                }}
                disableFuture
              />
            </div>
            <div className="mt-2">
              <MyDatePicker
                id="next7Days"
                label="Next 7 Days Only"
                control={control}
                validation={{
                  required: "Date is required",
                  validate: (value) => {
                    if (!value) return true;
                    const today = dayjs();
                    const maxDate = today.add(7, "day");

                    return (
                      dayjs(value).isBefore(maxDate.add(1, "second")) ||
                      "Date must be within the next 7 days"
                    );
                  },
                }}
              />
            </div>
            <div className="mt-2">
              <MyTimePicker
                id="time"
                label="Basic Time Picker"
                control={control}
                validation={{
                  required: "Time is required",
                }}
              />
            </div>
            <Button type="submit" className="mt-3">
              Submit
            </Button>
          </form>
        </FormProvider>
      </div>
    </main>
  );
};

export default DatepickerExample;
