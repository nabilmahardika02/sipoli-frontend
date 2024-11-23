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
