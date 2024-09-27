import Button from "@/components/elements/Button";
import Checkbox from "@/components/elements/forms/Checkbox";
import CheckboxGroup from "@/components/elements/forms/CheckboxGroup";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import { SandboxForm } from "@/types/forms/SandboxForm";
import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const checkboxOption: string[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const checkBoxGroupOption = [
  {
    value: "Senin",
    text: "Senin",
  },
  {
    value: "Selasa",
    text: "Selasa",
  },
  {
    value: "Rabu",
    text: "Rabu",
  },
  {
    value: "Kamis",
    text: "Kamis",
  },
];

const jenisKelamin = [
  {
    value: "Male",
    text: "Male",
  },
  {
    value: "Female",
    text: "Female",
  },
];

const InputExample = () => {
  const methods = useForm<SandboxForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<SandboxForm> = (data) => {
    console.table(data);
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
      <div className="mt-2 w-full md:w-[50%] p-5 rounded-xl border-2 border-primary-1 bg-white">
        <Typography className="mb-10">
          Check console to see the result
        </Typography>

        <FormProvider {...methods}>
          <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Input id="reguler" label="Reguler Input" />

            <Input
              id="required"
              label="Required"
              validation={{ required: "Wajib diisi" }}
            />

            <Input
              id="withHelper"
              label="With Helper Message"
              helperText="Isi dengan huruf kapital"
            />

            <Input
              id="password"
              type="password"
              label="Password"
              helperText="Password must be at least 8 characters"
            />

            <Input id="withPrefix" type="number" label="Price" prefix="Rp" />

            <Input id="withSuffix" type="number" label="Weight" suffix="kg" />

            <Input
              id="readOnly"
              type="text"
              label="Name Readonly"
              value={"Nabil"}
              readOnly
            />

            <SelectInput
              id="namaPasien"
              label="Nama Pasien"
              placeholder="Nama Pasien"
            >
              <option value="mazaya">Mazaya</option>
              <option value="nabil">Nabil Batuk</option>
              <option value="ayu">Ayu</option>
              <option value="nafriel">Nafriel</option>
            </SelectInput>

            <TextArea
              id="textarea"
              label="TextArea"
              placeholder="Insert text here.."
              maxLength={255}
            />

            <div className="grid grid-cols-3 md:grid-cols-4">
              {checkboxOption.map((option) => (
                <Checkbox
                  label={option}
                  name="individualCheckbox"
                  value={option}
                  key={option}
                />
              ))}

              {/* contoh disabled with checked value */}
              <Checkbox
                label="Libur"
                name="individualCheckbox"
                value="Libur"
                key="Libur"
                isChecked
                readOnly={true}
              />
            </div>

            {/* CHECKBOX GROUP */}
            <CheckboxGroup
              options={checkBoxGroupOption}
              name="checkboxGroup"
              label="Checkbox Group"
              className="mt-4"
              direction="grid"
            />

            {/* RADIOBUTTON GROUP */}
            <RadioButtonGroup
              name="jenisKelamin"
              options={jenisKelamin}
              label="Jenis Kelamin"
              direction="grid"
              validation={{ required: "Jenis kelamin wajib diisi" }}
            />

            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </main>
  );
};

export default InputExample;
