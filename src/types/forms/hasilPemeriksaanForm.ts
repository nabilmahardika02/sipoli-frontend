export type RujukanForm = {
  tujuanRujukan: string;
  dokterRujukan: string;
  catatanRujukan: string;
};

export type HasilPemeriksaanForm = {
  dokterPengirim: string;
  dokter: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
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
};

export type HasilKunjunganForm = {
  dokterPengirim: string;
  dokter: string;
  keluhanUtama: string;
  riwayatPenyakitSekarang: string;
  kie: string;
}

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
}