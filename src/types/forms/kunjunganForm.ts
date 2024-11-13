import { Dayjs } from "dayjs";

export type KunjunganForm = {
  sesi: number;
  accountId: string;
  profileId: string;
  tanggalKunjungan: string;
  jamMasuk: Dayjs;
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
