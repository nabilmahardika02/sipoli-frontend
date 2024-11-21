interface NewNotifikasiResponse {
  isExists: boolean;
  newNotifications: Notifikasi[];
}

interface Notifikasi {
  id: string;
  title: string;
  message?: string;
  readStatus: number;
  createdAt: string;
  kunjunganId: string;
}
