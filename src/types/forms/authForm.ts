export type LoginForm = {
  username: string;
  password: string;
};

export type RegisterForm = {
  role: string;
  name: string;
  jenisKelamin: boolean;
  noHp: string;
  tanggalLahir: string;
  unitKerja: string;
  jabatan: string;
  eselon: number;
  nik: string;
  username: string;
  alamat: string;
  kewarganegaraan: boolean;
};

export type UpdateAkunForm = {
  id: string;
  username: string;
  jabatan: string;
  unitKerja: string;
  eselon: number;
  name: string;
  jenisKelamin: boolean;
  noHp: string;
  tanggalLahir: string;
  alamat: string;
};

export type PasswordByAdminForm = {
  accountId: string;
  newPassword: string;
};

export type MyPasswordForm = {
  oldPassword: string;
  newPassword: string;
};
