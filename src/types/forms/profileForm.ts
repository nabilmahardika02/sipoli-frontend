export type AddProfileForm = {
  idAccount: string;
  nik: string;
  name: string;
  noHp: string;
  tanggalLahir: string;
  jenisKelamin: boolean;
  relative: number;
  kewarganegaraan: boolean;
};

export type UpdateProfileForm = {
  id: string;
  name: string;
  noHp: string;
  tanggalLahir: string;
  jenisKelamin: boolean;
  relative: number;
}