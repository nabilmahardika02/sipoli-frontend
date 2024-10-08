import { KuantitasObat } from "./kuantitasObat";
import { ResepObat } from "./resepObat";
import { Rujukan } from "./rujukan";
export interface RekamMedis {
    id: string;  // Tambahkan ID rekam medis
    beratBadan: number;
    tinggiBadan: number;
    tensi: string;
    diagnosis: string;
    resepObat: ResepObat;
    rujukan: Rujukan;
    listKuantitasObat: KuantitasObat[];
  }
