export interface AddRekamMedisForm {
  tinggiBadan: number;
  beratBadan: number;
  tensi: string;
  diagnosis: string;
  obatList?: { id: string; kuantitas: number }[]; // Daftar obat dengan kuantitas
  deskripsiResepObat?: string; // Optional: Deskripsi resep obat
  tujuanRujukan?: string;      // Optional: Tujuan rujukan
  dokterRujukan?: string;      // Optional: Nama dokter rujukan
  catatanRujukan?: string;     // Optional: Catatan rujukan
}
