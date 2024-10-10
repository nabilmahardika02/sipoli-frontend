import { Antrian } from "./antrian";
import { Profile } from "./profile";
import { RekamMedis } from "./rekamMedis";

export interface Kunjungan {
  id: string;
  tanggal: string;
  keluhan: string;
  status: number;
  antrian: Antrian;
  profile: Profile;
  rekamMedis: RekamMedis;
}