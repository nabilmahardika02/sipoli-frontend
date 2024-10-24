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
import { Profile } from "@/types/entities/profile";
import { Account } from "@/types/entities/account";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { KunjunganForm } from "@/types/forms/kunjunganForm";
import Divider from "@/components/elements/Divider";
import { Kunjungan } from "@/types/entities/kunjungan";

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
                            <RadioButtonGroup
                                name="sesi"
                                options={sesi}
                                label="Sesi"
                                direction="horizontal"
                                validation={{ required: "Mohon pilih sesi" }}
                                defaultValue={kunjungan?.antrian.sesi.toString()} // Preselect the sesi value
                            />
                            
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
                            <Divider/>
                            <Input
                                id="tanggalKunjungan"
                                label="Tanggal Kunjungan"
                                type="date"
                                defaultValue={kunjungan?.tanggal.toString().split("T")[0]}
                            />
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
