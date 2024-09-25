// DON'T CHANGE ANYTHING

export interface User {
  accountId: string;
  username: string;
  role: "PASIEN" | "DOKTER" | "PERAWAT" | "OPERATOR";
  isDefaultPassword: boolean;
  profileId: string;
  name: string;
  noHp: string | null;
  tanggalLahir: string | null;
  jenisKelamin: string | null;
  isEmployee: boolean;
  relative: number;
}

export interface withToken {
  token: string;
}
