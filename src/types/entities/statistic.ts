export interface JumlahKunjunganStatistic {
  period: string;
  jumlah: number;
}

export interface GeneralStatistic {
  label: string;
  amount: number;
}

export interface PieChartData {
  id: number;
  value: number;
  label: string;
}

export interface RujukanStatistic {
  id: string;
  tujuan: string;
  dokter: string;
  catatan: string;
  maksimalBerlaku: string;
  idKunjungan: string;
}

export interface KunjunganTerkini {
  jumlahToday: number;
  rataanBulan: number;
  jumlahBelumDilayani: number;
  jumlahSedangDilayani: number;
}
