import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import TextArea from "@/components/elements/forms/TextArea";
import MyTimePicker from "@/components/elements/forms/TimePicker";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { sesi } from "@/content/kunjungan";
import { useDocumentTitle } from "@/context/Title";
import {
  formatDateOnly,
  formatTimeDayjs,
  formatToDateInputValue,
} from "@/lib/formater";
import sendRequest from "@/lib/getApi";
import { Kunjungan } from "@/types/entities/kunjungan";
import { UpdateKunjunganForm } from "@/types/forms/kunjunganForm";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";

const KunjunganUpdatePage = () => {
  const [kunjungan, setKunjungan] = useState<Kunjungan>();
  const { setTitle } = useDocumentTitle();
  const router = useRouter();

  const [showInformationSunday, setShowInformationSunday] = useState(false);
  const [showInformationSaturday, setShowInformationSaturday] = useState(false);
  const [showAntrianInfo, setShowAntrianInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSesi, setSelectedSesi] = useState("");
  const [antrianInfo, setAntrianInfo] = useState(0);
  const [showSesi, setShowSesi] = useState(false);

  useEffect(() => {
    setTitle("Perbarui Kunjungan");
  }, [setTitle]);

  useEffect(() => {
    const fetchKunjungan = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan?id=" + router.query.id
      );

      if (isSuccess) {
        setKunjungan(responseData as Kunjungan);
        console.log(responseData);
      }
    };

    if (router.query.id) {
      fetchKunjungan();
    }
  }, [router.query.id]);

  const methods = useForm<UpdateKunjunganForm>({
    mode: "onTouched",
  });

  useEffect(() => {
    if (kunjungan) {
      methods.setValue("sesi", kunjungan.antrian.sesi.toString());
      methods.setValue(
        "tanggalKunjungan",
        formatToDateInputValue(kunjungan.tanggal)
      );
      methods.setValue("keluhan", kunjungan.keluhan);

      setSelectedDate(formatToDateInputValue(kunjungan.tanggal));
      setSelectedSesi(kunjungan.antrian.sesi.toString());

      const date = new Date(formatToDateInputValue(kunjungan.tanggal));
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        setShowAntrianInfo(true);
      }
    }
  }, [kunjungan, methods]);

  const { handleSubmit, control } = methods;

  const onSubmit: SubmitHandler<UpdateKunjunganForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        `kunjungan/update`,

        showInformationSunday
          ? { ...data, jamMasuk: formatTimeDayjs(data.jamMasuk) }
          : { ...data, id: router.query.id },
        true
      );

      if (isSuccess) {
        router.push("/home");
      }
    };

    postData();
  };

  useEffect(() => {
    const date = new Date(kunjungan?.tanggal as string);

    if (date.getDay() > 0 && date.getDay() < 6) {
      setShowSesi(true);
    } else if (date.getDay() === 0) {
      setShowInformationSunday(true);
    }
  }, [kunjungan]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    const date = new Date(selectedDate);
    setSelectedDate(selectedDate);

    if (date.getDay() === 0) {
      setShowInformationSunday(true);
      setShowInformationSaturday(false);
      setShowSesi(false);
      setShowAntrianInfo(false);
    } else if (date.getDay() === 6) {
      setShowInformationSaturday(true);
      setShowInformationSunday(false);
      setShowSesi(false);
      setShowAntrianInfo(false);
    } else {
      setShowInformationSunday(false);
      setShowInformationSaturday(false);
      setShowSesi(true);
      setShowAntrianInfo(true);
    }
  };

  useEffect(() => {
    const fetchAntrian = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "kunjungan/antrian?sesi=" + selectedSesi + "&tanggal=" + selectedDate
      );

      if (isSuccess) {
        setAntrianInfo(responseData as number);
      }
    };

    if (selectedSesi && selectedDate) {
      fetchAntrian();
    }
  }, [selectedSesi, selectedDate]);

  const handleSesiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSesi(event.target.value);
    setShowAntrianInfo(true);
  };

  return (
    <main>
      <Head>
        <title>Update Kunjungan</title>
      </Head>
      <section>
        <div className="flex justify-center md:hidden">
          <Typography variant="h4" className="text-primary-1">
            Ubah Data Kunjungan
          </Typography>
        </div>
        <Divider className="md:hidden" />
        {kunjungan && (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Input
                    id="tanggalKunjungan"
                    label="Tanggal Kunjungan"
                    type="date"
                    onChange={handleDateChange}
                  />
                  {showInformationSaturday && (
                    <Typography
                      variant="p2"
                      className="my-2 text-danger-core"
                      size="sm"
                    >
                      Poliklinik tidak dapat melayani di hari Sabtu
                    </Typography>
                  )}
                </div>

                {showInformationSunday && (
                  <MyTimePicker
                    id="jamMasuk"
                    label="Jam Kunjungan"
                    control={control}
                    validation={{
                      required: "Jam Kunjungan wajib diisi",
                    }}
                    minuteStep={15}
                    className="lg:w-full"
                    helperText="Silakan pilih waktu dalam WITA untuk berkunjung di hari Minggu"
                  />
                )}

                {showSesi && (
                  <RadioButtonGroup
                    name="sesi"
                    options={sesi}
                    label="Sesi"
                    directionClassName="flex flex-col md:grid md:grid-cols-2 gap-y-2"
                    defaultValue={kunjungan?.antrian.sesi.toString()}
                    onChange={handleSesiChange}
                  />
                )}

                {showAntrianInfo && antrianInfo != null && (
                  <Typography
                    variant="p2"
                    className="py-3 px-5 rounded-lg chips-success md:col-span-2 w-full md:w-[50%]"
                    size="sm"
                  >
                    <FaInfoCircle className="text-xl" />
                    {antrianInfo === 0
                      ? `Belum ada antrian di sesi ${selectedSesi} pada ${formatDateOnly(
                          selectedDate
                        )}`
                      : `Sudah ada ${antrianInfo} antrian di sesi ${selectedSesi} pada ${formatDateOnly(
                          selectedDate
                        )}`}
                  </Typography>
                )}

                <TextArea
                  id="keluhan"
                  label="Keluhan"
                  placeholder="Keluhan yang dirasakan"
                  maxLength={255}
                  validation={{ required: "Mohon beri tahu keluhan Anda" }}
                />
              </div>
              <div className="mt-5 flex items-center gap-4">
                <Button type="submit">Perbarui</Button>
                <Link href={"/home"}>
                  <Button variant="danger">Batal</Button>
                </Link>
              </div>
            </form>
          </FormProvider>
        )}
      </section>
    </main>
  );
};

export default withAuth(KunjunganUpdatePage, "user");
