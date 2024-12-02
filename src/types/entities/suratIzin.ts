import { Kunjungan } from "./kunjungan";

export interface SuratIzin {
  id: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  isActive: boolean;
  createdAt: string;
  kunjungan: Kunjungan;
  nomorSurat: string;
}
