import { Obat } from "./obat";
import { HasilPemeriksaan } from "./kunjungan";

export interface KuantitasObat {
  id: string;
  kuantitas: number;
  petunjukPemakaian: string;
  // namaObat: string; // Field untuk nama obat
  obat: Obat;       // Referensi ke entitas Obat
  hasilPemeriksaan: HasilPemeriksaan; // Referensi ke entitas HasilPemeriksaan
}
