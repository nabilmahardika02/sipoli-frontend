export interface Obat {
  id: string;
  namaObat: string;
  deskripsi: string;
  jenisSatuan: number;
  totalStok: number;
  deleteStatus: number;
  createdAt: string;
  updatedAt: string;
  listRestockObat: RestockObat[];
}

export interface RestockObat {
  id: string;
  tanggalPembelian: string;
  tanggalKadaluarsa: string;
  kuantitas: number;
  kuantitasSisa: number;
  hargaBeli: string;
  isApproved: number;
  expiredStatus: number;
}

export interface RestockObatResponse {
  id: string;
  tanggalPembelian: string;
  tanggalKadaluarsa: string;
  hargaBeli: number;
  kuantitas: number;
  isApproved: number;
  namaObat: string;
  createdAt: string;
}

export interface PemakaianObat {
  id: string;
  tanggal: Date;
  keterangan: string;
  jenisPemakaian: number;
  jumlah: number;
}
