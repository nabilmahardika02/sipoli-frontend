  import { KuantitasObat } from "./kuantitasObat";
  export interface RekamMedis {
    id: string;  // ID rekam medis
    beratBadan: number;
    tinggiBadan: number;
    tensi: string;
    diagnosis: string;
    deskripsiResepObat: string; // Optional: Deskripsi resep obat
    tujuanRujukan: string;      // Optional: Tujuan rujukan
    dokterRujukan: string;      // Optional: Nama dokter rujukan
    catatanRujukan: string;     // Optional: Catatan rujukan
    listKuantitasObat: KuantitasObat[];
}