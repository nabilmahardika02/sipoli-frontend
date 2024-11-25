export interface Profile {
  id: string;
  accountId: string | null;
  name: string;
  noHp: string;
  tanggalLahir: string;
  jenisKelamin: boolean;
  isEmployee: boolean;
  relative: number;
  nik: string | null;
  noRekamMedis: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  kewarganegaraan: boolean;
}

export interface RiwayatPenyakitDahulu {
  id: string;
  kelainanJantung: string;
  penyakitHati: string;
  kelainanSaluranCerna: string;
  kencingManis: string;
  rawatInap: string;
  kecelakaan: string;
  tindakanBedah: string;
  lainnya: string;
}

export interface RiwayatPenyakitKeluarga {
  id: string;
  kencingManis: string;
  darahTinggi: string;
  penyakitJantung: string;
  tumor: string;
  ginjal: string;
  gangguanJiwa: string;
  lainnya: string;
}

export interface Kebiasaan {
  id: string;
  merokok: string;
  alkohol: string;
  olahraga: string;
  obatObatan: string;
}

export interface Pasien {
  id: string;
  name: string;
  nik: string;
  noHp: string;
  tanggalLahir: string;
  jenisKelamin: boolean;
  isEmployee: boolean;
  relative: number;
  noRekamMedis: string;
  riwayatPenyakitDahulu: RiwayatPenyakitDahulu;
  riwayatPenyakitKeluarga: RiwayatPenyakitKeluarga;
  kebiasaan: Kebiasaan;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
