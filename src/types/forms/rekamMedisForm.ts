export interface RekamMedisForm {
    beratBadan: number;
    tinggiBadan: number;
    tensiDarah: string;
    diagnosis: string;
    resepObat?: string; // Optional
    rujukanKepada?: string; // Optional
    rujukanRumahSakit?: string; // Optional
    obatList?: { id: string; kuantitas: number }[]; // Daftar obat yang dipilih dengan kuantitas
}
