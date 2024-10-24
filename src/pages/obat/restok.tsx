import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import SelectInput from "@/components/elements/forms/SelectInput";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { Obat } from "@/types/entities/obat";
import { RestockListForm } from "@/types/forms/obatForm";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const RestockPage = () => {
  const { setTitle } = useDocumentTitle();
  const router = useRouter();
  const [listObat, setListObat] = useState<Obat[]>();
  const [restockListValue, setRestockListValue] = useState<RestockListForm>({
    tanggalPembelian: "",
    restockItemList: [],
  });

  useEffect(() => {
    setTitle("Restock Obat");
  }, [setTitle]);

  useEffect(() => {
    const fetchData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "get",
        "obat/all"
      );

      if (isSuccess) {
        setListObat(responseData as Obat[]);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestockListValue({
      ...restockListValue,
      tanggalPembelian: event.target.value,
    });
  };

  const handleAddRow = () => {
    setRestockListValue((prevState) => ({
      ...prevState,
      restockItemList: [
        ...prevState.restockItemList,
        {
          idObat: undefined,
          qty: 0,
        },
      ],
    }));
  };

  const handleChangeIdObat = (
    i: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const updatedRestockItemList = [...restockListValue.restockItemList];

    updatedRestockItemList[i] = {
      ...updatedRestockItemList[i],
      idObat: event.target.value,
    };

    setRestockListValue({
      ...restockListValue,
      restockItemList: updatedRestockItemList,
    });
  };

  const handleChangeQtyObat = (
    i: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedRestockItemList = [...restockListValue.restockItemList];

    updatedRestockItemList[i] = {
      ...updatedRestockItemList[i],
      qty: Number(event.target.value),
    };

    setRestockListValue({
      ...restockListValue,
      restockItemList: updatedRestockItemList,
    });
  };

  const methods = useForm<RestockListForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<RestockListForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "obat/restock-list",
        restockListValue,
        true
      );

      if (isSuccess) {
        router.push("/obat");
      }
    };

    postData();
  };

  return (
    <main>
      <Head>
        <title>Restock Obat</title>
      </Head>
      <Typography variant="h4" className="mb-2 md:hidden">
        Restock Obat
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              id="tanggalPembelian"
              placeholder="Tanggal Pembelian"
              validation={{ required: "Tanggal Pembelian wajib diisi" }}
              label="Tanggal Pembelian"
              type="date"
              onChange={handleDateChange}
            />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <Typography weight="bold" className="text-primary-1">
              Data Obat
            </Typography>
            <Button onClick={handleAddRow}>Tambah Input Pembelian</Button>
          </div>
          <div className="rounded-lg overflow-y-hidden overflow-x-auto mt-4 shadow-lg">
            <table className="w-full rounded-xl border border-gray-300">
              <thead className="bg-primary-1 text-white">
                <tr className="font-bold">
                  <th className="text-center px-5 py-2">Obat</th>
                  <th className="text-center px-5 py-2">Kuantitas</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {restockListValue.restockItemList.map((restockItem, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 border">
                      <SelectInput
                        id={`idObat_` + index}
                        placeholder="Pilih Obat"
                        validation={{ required: "Obat wajib dipilih" }}
                        className="mt-0"
                        onChange={(
                          event: React.ChangeEvent<HTMLSelectElement>
                        ) => handleChangeIdObat(index, event)}
                      >
                        {listObat?.map((obat) => (
                          <option key={obat.id} value={obat.id}>
                            {obat.namaObat}
                          </option>
                        ))}
                      </SelectInput>
                    </td>
                    <td className="px-4 py-4 border">
                      <Input
                        id={"qty" + index}
                        placeholder="Kuantitas Restock"
                        validation={{
                          required: "Kuantitas restock wajib diisi",
                        }}
                        type="number"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => handleChangeQtyObat(index, event)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <Button type="submit">Submit</Button>
            <Link href={"/obat"}>
              <Button variant="danger">Cancel</Button>
            </Link>
          </div>
        </form>
      </FormProvider>
    </main>
  );
};

export default withAuth(RestockPage, "PERAWAT");
