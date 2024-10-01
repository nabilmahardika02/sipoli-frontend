import { Antrian } from "./antrian";

export interface Kunjungan {
    id: string,
    tanggal: string,
    keluhan: string,
    status: number,
    antrian: Antrian
}