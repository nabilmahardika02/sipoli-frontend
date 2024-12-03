export type RujukanForm = {
  tujuanRujukan: string;
  dokterRujukan: string;
  catatanRujukan: string;
};

export interface KuantitasObatRequest {
  obatId: string;
  namaObat: string;
  kuantitas: number;
  petunjukPemakaian: string;
  tanggalKadaluarsa: string;
  jenisSatuan: string;
}

export type ResepObatRujukanForm = {
  deskripsi: string;
};

export type HasilPemeriksaanForm = {
  dokter: string;
  tanggalPeriksa: string;
  keluhanUtama: string;
  riwayatPenyakitSekarang: string;
  kie: string;
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
  mata: string;
  telinga: string;
  hidung: string;
  tonsil: string;
  faring: string;
  cor: string;
  pulmo: string;
  abd: string;
  ext: string;
  icd10: string;
  diagnosaKerja: string;
  rencana: string;
  tindakan: string;
  deskripsi: string;
  rujukanRequestDTO: RujukanForm;
  listKuantitasObatDTO: KuantitasObatRequest[];
  resepObatRujukan: ResepObatRujukanForm; 
};

export type HasilKunjunganForm = {
  dokter: string;
  keluhanUtama: string;
  riwayatPenyakitSekarang: string;
  kie: string;
  tanggalPeriksa: string;
};

export type HasilPemeriksaanFisikForm = {
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
};

export type UpdatePemeriksaanFisikForm = {
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
};

export type UpdateStatusPresentForm = {
  mata: string;
  telinga: string;
  hidung: string;
  tonsil: string;
  faring: string;
  cor: string;
  pulmo: string;
  abd: string;
  ext: string;
};

export type UpdateHasilKunjunganForm = {
  keluhanUtama: string;
  riwayatPenyakitSekarang: string;
  kie: string;
};

export type UpdateDiagnosaAkhirForm = {
  icd10: string;
  diagnosaKerja: string;
  rencana: string;
  tindakan: string;
};

export type UpdateResepObatRujukanForm = {
  id: string;
  deskripsi: string;
};

export type UpdateRujukanForm = {
  tujuanRujukan: string;
  dokterRujukan: string;
  catatanRujukan: string;
};
