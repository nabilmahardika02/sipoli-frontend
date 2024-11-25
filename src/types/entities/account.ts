import { Profile } from "./profile";

export interface Account {
  id: string;
  username: string;
  password: string;
  role: string;
  isActive: boolean;
  isDefaultPassword: boolean;
  createdAt: string;
  updatedAt: string;
  jabatan: string;
  unitKerja: string;
  eselon: number;
  listProfile: Profile[];
  alamat: string;
}
