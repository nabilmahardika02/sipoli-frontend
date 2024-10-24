export interface Obat {
  id: string;
  namaObat: string;
  deskripsi: string;
  jenisSatuan: number;
  totalStok: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  listRestockObat: RestockObat[];
}

export interface RestockObat {
  id: string;
  tanggalPembelian: string;
  kuantitas: number;
}
