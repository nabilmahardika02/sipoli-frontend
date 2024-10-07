import { Obat } from "./obat";

export interface RekamMedis {
    namaPasien: string;
    tanggalKunjungan: string;
    keluhan: string;
    tinggiBadan: number;
    beratBadan: number;
    tensiDarah: string;
    diagnosis: string;
    resepObat?: string; // Optional
    rujukanKepada?: string; // Optional
    rujukanRumahSakit?: string; // Optional
    obatList?: Obat[]; // Daftar obat yang diresepkan
}