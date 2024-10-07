import { KuantitasObat } from "./kuantitasObat";
import { ResepObat } from "./resepObat";
import { Rujukan } from "./rujukan";

export interface RekamMedis {
    beratBadan: number;
    tinggiBadan: number;
    tensi: string;
    catatanInternal: string;
    diagnosis: string;
    resepObat: ResepObat;
    rujukan: Rujukan;
    listKuantitasObat: KuantitasObat[];
}