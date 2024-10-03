import { Antrian } from "./antrian";
import { Profile } from "./profile";

export interface Kunjungan {
    id: string,
    tanggal: string,
    keluhan: string,
    status: number,
    antrian: Antrian,
    profile: Profile
}