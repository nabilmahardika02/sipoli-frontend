import { Antrian } from "./antrian";
import { Profile } from "./profile";

export interface Kunjungan {
  id: string;
  tanggal: string;
  dokterPengirim: string;
  dokter: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  keluhan: string;
  status: number;
  antrian: Antrian;
  hasilPemeriksaan: HasilPemeriksaan;
  profile: Profile;
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
}
