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
  tanggalPembelian: string;
  tanggalKadaluarsa: string;
  qty: number;
  hargaBeli: number;
};

export type RestockListForm = {
  tanggalPembelian: string;
  restockItemList: RestockListItem[];
};

export type RestockListItem = {
  idObat: string | undefined;
  qty: number;
  hargaBeli: number;
  tanggalKadaluarsa: string | undefined;
};
