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
  tanggalKadaluarsa: string;
  kuantitas: number;
  hargaBeli: string;
  isApproved: number;
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