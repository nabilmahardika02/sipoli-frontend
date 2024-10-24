export type KunjunganForm = {
  sesi: number;
  accountId: string;
  profileId: string;
  tanggalKunjungan: string;
  status: number;
  keluhan: string;
};

export type CancelKunjunganForm = {
  status: number;
};

export type FilterKunjunganForm = {
  startDate: string;
  endDate: string;
};
