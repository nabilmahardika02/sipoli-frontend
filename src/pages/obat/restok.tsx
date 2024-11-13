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
          hargaBeli: 0,
          tanggalKadaluarsa: undefined,
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

  const handleChangeHargaBeli = (
    i: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedRestockItemList = [...restockListValue.restockItemList];

    updatedRestockItemList[i] = {
      ...updatedRestockItemList[i],
      hargaBeli: Number(event.target.value),
    };

    setRestockListValue({
      ...restockListValue,
      restockItemList: updatedRestockItemList,
    });
  };

  const handleChangeTanggalKadaluarsa = (
    i: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedRestockItemList = [...restockListValue.restockItemList];

    updatedRestockItemList[i] = {
      ...updatedRestockItemList[i],
      tanggalKadaluarsa: event.target.value,
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
          <div className="rounded-lg overflow-y-hidden overflow-x-auto mt-4 pb-4">
            <div className="table-wrapper">
              <table className="w-full rounded-xl shadow-lg">
                <thead className="bg-primary-1 text-white">
                  <tr>
                    <th className="md:w-[30%]">Obat</th>
                    <th>Kuantitas</th>
                    <th>Harga Beli Satuan</th>
                    <th>Tanggal Kadaluarsa</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {restockListValue.restockItemList.map(
                    (restockItem, index) => (
                      <tr key={index}>
                        <td>
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
                        <td>
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
                        <td>
                          <Input
                            id={"hargaBeli" + index}
                            placeholder="Harga Beli"
                            validation={{
                              required: "Harga beli wajib diisi",
                            }}
                            type="number"
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => handleChangeHargaBeli(index, event)}
                          />
                        </td>
                        <td>
                          <Input
                            id={"tanggalKadaluarsa" + index}
                            placeholder="Tanggal Kadaluarsa"
                            validation={{
                              required: "Tanggal kadaluarsa wajib diisi",
                            }}
                            type="date"
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => handleChangeTanggalKadaluarsa(index, event)}
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
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
