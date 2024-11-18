import { Dayjs } from "dayjs";

export type AddObatForm = {
  namaObat: string;
  deskripsi: string;
  jenisSatuan: number;
};

export type UpdateObatForm = {
  id: string;
  namaObat: string;
  deskripsi: string;
  jenisSatuan: number;
};

export type RestockForm = {
  tanggalPembelian: Dayjs;
  tanggalKadaluarsa: Dayjs;
  qty: number;
  hargaBeli: number;
};

export type RestockListForm = {
  tanggalPembelian: Dayjs;
  restockItemList: RestockListItem[];
};

export type RestockListItem = {
  idObat: string | undefined;
  qty: number;
  hargaBeli: number;
  tanggalKadaluarsa: string | undefined;
};
