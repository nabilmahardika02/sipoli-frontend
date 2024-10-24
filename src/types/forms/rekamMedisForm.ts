export interface AddRekamMedisForm {
  tinggiBadan: number;
  beratBadan: number;
  tensi: string;
  diagnosis: string;
  obatList?: { id: string; kuantitas: number }[];
  deskripsiResepObat?: string;
  tujuanRujukan?: string;
  dokterRujukan?: string;
  catatanRujukan?: string;
}

export interface UpdateRekamMedisForm {
  profileId: string;
  merokok: string;
  alkohol: string;
  olahraga: string;
  obatObatan: string;
  kelainanJantung: string;
  penyakitHati: string;
  kelainanSaluranCerna: string;
  kencingManisPribadi: string;
  rawatInap: string;
  kecelakaan: string;
  tindakanBedah: string;
  riwayatSakitLainnya: string;
  kencingManisKeluarga: string;
  darahTinggi: string;
  penyakitJantung: string;
  tumor: string;
  ginjal: string;
  gangguanJiwa: string;
  riwayatKeluargaLainnya: string;
}
