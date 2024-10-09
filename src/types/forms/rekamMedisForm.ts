export interface AddRekamMedisForm {
    tinggiBadan: number;
    beratBadan: number;
    tensi: string;
    diagnosis: string;
    obatList?: { id: string; kuantitas: number }[]; // Optional
    resepObat?: string; // Optional
    rujukanRumahSakit?: string; // Optional
    rujukanDokter?: string; // Optional
    rujukanCatatan?: string; // Optional
  }
