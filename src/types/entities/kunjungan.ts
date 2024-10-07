import { Profile } from "./profile"; 
import { RekamMedis } from "./rekamMedis";

// ini gue buat karena perlu, dan sebelumnya nggak ada entities kunjungan (gue belum pull yg terbaru)
export interface Kunjungan {
    id: string;
    profile: Profile; // Relasi ke profile
    tanggal: string; // Tanggal kunjungan
    keluhan: string; // Keluhan pasien 
    status: string; 
    rekamMedis?: RekamMedis; // Optional, relasi ke rekam medis jika sudah dibuat
}
