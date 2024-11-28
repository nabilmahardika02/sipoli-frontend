import { Antrian } from "./antrian";
import { Profile } from "./profile";
import { Obat } from "./obat";

export interface Kunjungan {
  id: string;
  tanggal: string;
  dokter: Dokter;
  tanggalPeriksa: string;
  keluhan: string;
  status: number;
  antrian: Antrian;
  hasilPemeriksaan: HasilPemeriksaan;
  profile: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface ResepObatRujukan {
  id: string;
  deskripsi: string;
}

export interface Rujukan {
  id: string;
  tujuan: string;
  dokter: string;
  catatan: string;
  maksimalBerlaku: string;
}

export interface PemeriksaanFisik {
  id: string;
  tensi: string;
  suhu: number;
  meanArteri: number;
  respiratoryRate: number;
  heartRate: number;
  oxygenSaturation: number;
  kesadaran: string;
  eye: number;
  verbal: number;
  motorik: number;
}

export interface StatusPresent {
  id: string;
  mata: string;
  telinga: string;
  hidung: string;
  tonsil: string;
  faring: string;
  cor: string;
  pulmo: string;
  abd: string;
  ext: string;
}

export interface DiagnosaAkhir {
  id: string;
  icd10: string;
  diagnosaKerja: string;
  rencana: string;
  tindakan: string;
}

export interface HasilPemeriksaan {
  id: string;
  keluhanUtama: string;
  riwayatPenyakitSekarang: string;
  kie: string;
  resepObatRujukan: ResepObatRujukan;
  rujukan: Rujukan;
  pemeriksaanFisik: PemeriksaanFisik;
  statusPresent: StatusPresent;
  diagnosaAkhir: DiagnosaAkhir;
  listKuantitasObat: KuantitasObat[]; // tambahan
}

// baru
export interface KuantitasObat {
  id: string;
  obatId: String;
  obat: Obat;  // Direct reference to the Obat entity
  kuantitas: number;
  petunjukPemakaian: string;
}
export interface Dokter {
  id: string;
  name: string;
  noHp: string;
  tanggalLahir: string;
  jenisKelamin: boolean;
  nik: string;
  noRekamMedis: string;
  relative: number;
  isActive: boolean;
  isEmployee: boolean;
  createdAt: string;
  updatedAt: string;
}