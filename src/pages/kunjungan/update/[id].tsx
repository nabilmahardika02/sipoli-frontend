import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import RadioButtonGroup from "@/components/elements/forms/RadioButtonGroup";
import SelectInput from "@/components/elements/forms/SelectInput";
import TextArea from "@/components/elements/forms/TextArea";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { KunjunganForm } from "@/types/forms/kunjunganForm";
import Divider from "@/components/elements/Divider";
import { Kunjungan } from "@/types/entities/kunjungan";
import { formatDateOnly } from "@/lib/formater";

const sesi = [
    {
        value: "1",
        text: "Sesi 1 (08:00 - 10:00 WITA)",
    },
    {
        value: "2",
        text: "Sesi 2 (10:00 - 12:00 WITA)",
    },
    {
        value: "3",
        text: "Sesi 3 (13:00 - 15:00 WITA)",
    },
    {
        value: "4",
        text: "Sesi 4 (15:00 - 16:30 WITA)",
    },
];

const KunjunganUpdatePage = () => {
    const user = useAuthStore.useUser();
    const { setTitle } = useDocumentTitle();
    const router = useRouter();
    const [kunjungan, setKunjungan] = useState<Kunjungan>();
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
                "kunjungan?id=" + router.query.id,  // Use a query parameter if necessary
            );

            if (isSuccess) {
                setKunjungan(responseData as Kunjungan);
            }
        };

        if (router.query.id) {
            fetchKunjungan();  // Fetch existing kunjungan data
        }
        console.log(kunjungan?.tanggal.toString().split("T")[0]);
    }, [router.query.id]);

    const methods = useForm<KunjunganForm>({
        defaultValues: kunjungan || {},
        mode: "onTouched",
    });

    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<KunjunganForm> = (data) => {
      const postData = async () => {
          // Send the PUT request with the correct endpoint and data
          const [responseData, message, isSuccess] = await sendRequest(
              "put",
              `kunjungan/update`,  // No need to append the ID if it's included in the data
              data,                // Pass the form data, assuming it includes the necessary ID
              true                 // true indicates that this request needs authorization (like token headers)
          );

          // If the request is successful, navigate back to the home page
          if (isSuccess) {
              router.push("/home");
          } else {
              console.error("Gagal untuk memperbarui kunjungan:", message);
          }
      };

      postData();
    };

    useEffect(() => {
        const date = new Date(kunjungan?.tanggal as string);
        console.log(date);

        if (date.getDay() > 0 && date.getDay() < 6) {
            setShowSesi(true);
        }

    }, [kunjungan]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        const date = new Date(selectedDate);
        setSelectedDate(selectedDate); // Store the selected date
    
        if (date.getDay() === 0) { //sunday
          setShowInformationSunday(true);
          setShowInformationSaturday(false);
          setShowSesi(false);
          setShowAntrianInfo(false);
        } else if (date.getDay() === 6) { //saturday
          setShowInformationSaturday(true);
          setShowInformationSunday(false);
          setShowSesi(false);
          setShowAntrianInfo(false);
        } else {
          setShowInformationSunday(false);
          setShowInformationSaturday(false);
          setShowSesi(true);
          setShowAntrianInfo(false);
        }
    };

    useEffect(() => {
        // Fungsi untuk mengambil data profil dari API
        const fetchAntrian = async () => {
          const [responseData, message, isSuccess] = await sendRequest(
            "get",
            "kunjungan/antrian?sesi=" + selectedSesi + "&tanggal=" + selectedDate
          );
    
          if (isSuccess) {
            setAntrianInfo(responseData as number); 
          }
        };
    
        if (selectedSesi) {
          fetchAntrian();
        }
    
    }, [selectedSesi]);

    const handleSesiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSesi(event.target.value);
        setShowAntrianInfo(true);
    }

    return (
        <main>
            <section>
                <div className="flex justify-center md:hidden">
                    <Typography variant="h4" className="text-primary-1">Memperbarui Kunjungan</Typography>
                </div>
                <Divider className="md:hidden"/>
                {kunjungan &&
                    <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                        <div className="justify-between gap-5 my-5 md:grid-cols-2">
                            <Input
                                id="tanggalKunjungan"
                                label="Tanggal Kunjungan"
                                type="date"
                                onChange={handleDateChange}
                                defaultValue={kunjungan?.tanggal.toString().split("T")[0]}
                            />
                            {showInformationSunday && (
                                <Typography variant="p2" className="my-2 text-gray-600" size="sm">
                                    Poliklinik hanya dapat melayani pada pukul 14:00 - 17:00 WITA di hari Minggu
                                </Typography>
                            )}
                            {showInformationSaturday && (
                                <Typography variant="p2" className="my-2 text-danger-core" size="sm">
                                    Poliklinik tidak dapat melayani di hari Sabtu
                                </Typography>
                            )}
                            {showSesi && (<RadioButtonGroup
                                name="sesi"
                                options={sesi}
                                label="Sesi"
                                direction="horizontal"
                                onChange={handleSesiChange}
                                defaultValue={kunjungan?.antrian.sesi.toString()} // Preselect the sesi value
                            />)}
                            {showAntrianInfo && antrianInfo === 0 && (
                                <Typography variant="p2" className="my-2 text-gray-600" size="sm">
                                    Belum ada antrian di sesi {selectedSesi} pada {formatDateOnly(selectedDate)}
                                </Typography>
                            )}
                            {showAntrianInfo && antrianInfo > 0 && (
                                <Typography variant="p2" className="my-2 text-gray-600" size="sm">
                                    Sudah ada {antrianInfo} antrian di sesi {selectedSesi} pada {formatDateOnly(selectedDate)}
                                </Typography>
                            )}
                            <div className="justify-between gap-5 my-5">
                              <Input
                                id="id"
                                defaultValue={kunjungan.id}
                                className="hidden"
                              >
                              </Input>
                                
                                <SelectInput
                                    id="profileId"
                                    className="hidden"
                                >
                                  <option value={kunjungan.profile.id}></option>
                                </SelectInput>
                            </div>
                            {user?.role !== "PASIEN" && (
                                <SelectInput
                                    id="status"
                                    label="Status"
                                    placeholder="Pilih status"
                                    validation={{ required: "Status wajib diisi" }}
                                    defaultValue={kunjungan.status}
                                >
                                    <option value="0">Belum Dilayani</option>
                                    <option value="1">Sedang Dilayani</option>
                                    <option value="2">Selesai</option>
                                    <option value="3">Dibatalkan</option>
                                </SelectInput>
                            )}
                            {user?.role === "PASIEN" && (
                                <SelectInput
                                id="status"
                                defaultValue={kunjungan.status}
                                className="hidden"
                            >
                                <option value="0">Belum Dilayani</option>
                            </SelectInput>
                            )}
                            <TextArea
                                id="keluhan"
                                label="Keluhan"
                                placeholder="Keluhan yang dirasakan"
                                maxLength={255}
                                validation={{ required: "Mohon beri tahu keluhan Anda" }}
                                defaultValue={kunjungan?.keluhan}
                            />
                        </div>
                        <div className="mt-5 flex items-center justify-center gap-4">
                            <Button type="submit">Submit</Button>
                            <Link href={"/home"}>
                                <Button variant="danger">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                    </FormProvider>
                }
            </section>
        </main>
    );
};

export default withAuth(KunjunganUpdatePage, "user");
