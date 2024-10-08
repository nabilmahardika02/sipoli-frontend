export interface AddRekamMedisForm {
    tinggiBadan: number;
    beratBadan: number;
    tensi: string;
    diagnosis: string;
    obatList?: { id: string; kuantitas: number }[]; // Optional
    resepObat?: string; // Optional
    rujukanKepada?: string; // Optional
    rujukanRumahSakit?: string; // Optional
    rujukanCatatan?: string; // Optional
  }
  
export interface UpdateRekamMedisForm {
  tinggiBadan: number;
  beratBadan: number;
  tensi: string;
  diagnosis: string;
  obatList?: { id: string; kuantitas: number }[]; // Optional
  resepObat?: string; // Optional
  rujukanKepada?: string; // Optional
  rujukanRumahSakit?: string; // Optional
  rujukanCatatan?: string; // Optional
}