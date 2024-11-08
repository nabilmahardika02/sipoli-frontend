export type RujukanForm = {
  tujuanRujukan: string;
  dokterRujukan: string;
  catatanRujukan: string;
};

export type UpdateRujukanForm = {
  tujuanRujukan: string;
  dokterRujukan: string;
  catatanRujukan: string;
}

// baru
export type KuantitasObatRequest = {
  obatId: string;
  kuantitas: number;
  petunjukPemakaian: string;
};
// baru

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
  listKuantitasObat: KuantitasObatRequest[]; // baru
  resepObatRujukan: string; // Tambahkan ini
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
}

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
}

export type UpdateHasilKunjunganForm = {
  keluhanUtama: string;
  riwayatPenyakitSekarang: string;
  kie: string;
}

export type UpdateDiagnosaAkhirForm = {
  icd10: string;
  diagnosaKerja: string;
  rencana: string;
  tindakan: string;
}

export type UpdateResepObatRujukanForm = {
  id: string;
  deskripsi: string;
}