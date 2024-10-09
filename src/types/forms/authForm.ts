export type LoginForm = {
  username: string;
  password: string;
};

export type RegisterForm = {
  username: string;
  role: string;
  nip: string;
  jabatan: string;
  unitKerja: string;
  eselon: number;
  name: string;
  jenisKelamin: boolean;
  noHp: string;
  tanggalLahir: string;
};

export type UpdateForm = {
  id: string;
  username: string;
  role: string;
  nip: string;
  jabatan: string;
  unitKerja: string;
  eselon: number;
  name: string;
  jenisKelamin: boolean;
  noHp: string;
  tanggalLahir: string;
}

export type PasswordByAdminForm = {
  accountId: string;
  newPassword: string;
}

export type MyPasswordForm = {
  oldPassword: string;
  newPassword: string;
}
