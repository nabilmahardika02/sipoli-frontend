import { Obat } from "./obat"; 
import { RekamMedis } from "./rekamMedis";

export interface KuantitasObat {
    id: string;
    kuantitas: number;
    obat: Obat; 
    rekamMedis: RekamMedis;
}
