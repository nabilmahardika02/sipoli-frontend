// import Button from "@/components/elements/Button";
// import Input from "@/components/elements/forms/Input";
// import SelectInput from "@/components/elements/forms/SelectInput";
// import TextArea from "@/components/elements/forms/TextArea";
// import Typography from "@/components/elements/Typography";
// import withAuth from "@/components/hoc/withAuth";
// import { useDocumentTitle } from "@/context/Title";
// import { checkRole } from "@/lib/checkRole";
// import sendRequest from "@/lib/getApi";
// import { Kunjungan } from "@/types/entities/kunjungan";
// import { Obat } from "@/types/entities/obat";
// import { RekamMedis } from "@/types/entities/rekamMedis";
// import { AddRekamMedisRequestDTO } from "@/types/forms/rekamMedisForm";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

// const RekamMedisUpdatePage = () => {
//   const { setTitle } = useDocumentTitle();
//   const [rekamMedis, setRekamMedis] = useState<RekamMedis | null>(null);
//   const [kunjungan, setKunjungan] = useState<Kunjungan | null>(null);
//   const [obatList, setObatList] = useState<Obat[]>([]);
//   const [obatSelected, setObatSelected] = useState<
//     { id: string; kuantitas: number }[]
//   >([]);
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//     setTitle("Memperbarui Rekam Medis");
//   }, [setTitle]);

//   if (!checkRole(["OPERATOR", "DOKTER", "PERAWAT"])) {
//     router.push("/403");
//   }

//   // Fetch rekam medis data
//   useEffect(() => {
//     if (router.isReady && id) {
//       const fetchRekamMedis = async () => {
//         const [responseData, message, isSuccess] = await sendRequest(
//           "get",
//           `rekam-medis/read/${id}`
//         );
//         if (isSuccess) {
//           setRekamMedis(responseData as RekamMedis);
//           setObatSelected(responseData.listKuantitasObat);
//         } else {
//           alert("Gagal mendapatkan data rekam medis");
//         }
//       };
//       fetchRekamMedis();
//     }
//   }, [router.isReady, id]);

//   // Fetch kunjungan data berdasarkan rekamMedisId dari rekam medis
//   useEffect(() => {
//     if (rekamMedis) {
//       const fetchKunjungan = async () => {
//         const [responseData, message, isSuccess] = await sendRequest(
//           "get",
//           `kunjungan/read-by-rekam-medis-id?rekamMedisId=${rekamMedis.id}`
//         );
//         if (isSuccess) {
//           setKunjungan(responseData as Kunjungan);
//         } else {
//           console.error("Gagal mendapatkan data kunjungan", message);
//         }
//       };
//       fetchKunjungan();
//     }
//   }, [rekamMedis]);

//   // Fetch daftar obat yang tersedia
//   useEffect(() => {
//     const fetchObat = async () => {
//       const [responseData, message, isSuccess] = await sendRequest(
//         "get",
//         "obat/available"
//       );
//       if (isSuccess) {
//         setObatList(responseData as Obat[]);
//       }
//     };

//     fetchObat();
//   }, []);

//   const methods = useForm<AddRekamMedisRequestDTO>({
//     mode: "onTouched",
//   });

//   const { handleSubmit, watch, setValue } = methods;

//   // Set nilai default berdasarkan data rekam medis yang diambil
//   useEffect(() => {
//     if (rekamMedis) {
//       setValue("tinggiBadan", rekamMedis.tinggiBadan);
//       setValue("beratBadan", rekamMedis.beratBadan);
//       setValue("tensi", rekamMedis.tensi);
//       setValue("diagnosis", rekamMedis.diagnosis);
//       setValue("deskripsiResepObat", rekamMedis.deskripsiResepObat || "");
//       setValue("tujuanRujukan", rekamMedis.tujuanRujukan || "");
//       setValue("dokterRujukan", rekamMedis.dokterRujukan || "");
//       setValue("catatanRujukan", rekamMedis.catatanRujukan || "");
//     }
//   }, [rekamMedis, setValue, obatSelected]);

//   // Set nilai default untuk keluhan, tanggal kunjungan, dan nama pasien dari kunjungan
//   useEffect(() => {
//     if (kunjungan) {
//       setValue("keluhan", kunjungan.keluhan);
//       // setValue("tanggalKunjungan", kunjungan.tanggal);
//       setValue("namaPasien", kunjungan.profile.name);
//     }
//   }, [kunjungan, setValue]);

//   const onSubmit: SubmitHandler<AddRekamMedisRequestDTO> = async (data) => {
//     if (!id) {
//       alert("Parameter ID rekam medis tidak ada!");
//       return;
//     }

//     const payload = {
//       ...data,
//       kuantitasObat: obatSelected.map((obat) => ({
//         obatId: obat.id,
//         kuantitas: obat.kuantitas,
//       })),
//     };

//     const [responseData, message, isSuccess] = await sendRequest(
//       "put",
//       `rekam-medis/update/${id}`,
//       payload,
//       true
//     );

//     if (isSuccess) {
//       router.push(`/rekam-medis/detail/${id}`);
//     }
//   };

//   const handleAddObat = () => {
//     const obatId = watch("obatId");
//     const kuantitas = watch("kuantitasObat");
//     if (obatId && kuantitas > 0) {
//       setObatSelected([...obatSelected, { id: obatId, kuantitas }]);
//       setValue("obatId", "");
//       setValue("kuantitasObat", "");
//     }
//   };

//   const handleRemoveObat = (id: string) => {
//     setObatSelected(obatSelected.filter((obat) => obat.id !== id));
//   };

//   const handleEditObat = (id: string) => {
//     const obatToEdit = obatSelected.find((obat) => obat.id === id);
//     setValue("obatId", obatToEdit?.id);
//     setValue("kuantitasObat", obatToEdit?.kuantitas);
//     handleRemoveObat(id);
//   };

//   // Gabungkan data kuantitas obat dengan nama obat
//   const obatWithNames = obatSelected.map((obatItem) => {
//     const obatInfo = obatList.find((obat) => obat.id === obatItem.id);
//     return {
//       ...obatItem,
//       namaObat: obatInfo ? obatInfo.namaObat : "Nama obat",
//     };
//   });

//   const [obatId, setObatId] = useState<string>("");

//   const handleObatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setObatId(event.target.value); // Set nilai obat yang dipilih ke state
//   };

//   return (
//     <main>
//       <section>
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
//             <Typography
//               variant="h5"
//               weight="bold"
//               className="text-primary-1 mb-5"
//             >
//               Rekam Medis Pasien
//             </Typography>

//             <Typography variant="h5" weight="bold" className="mt-8">
//               Informasi Pasien
//             </Typography>
//             {kunjungan && (
//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <Input
//                     id="namaPasien"
//                     label="Nama Pasien"
//                     value={kunjungan.profile.name || ""}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <Input
//                     id="tanggalKunjungan"
//                     label="Tanggal Kunjungan"
//                     value={new Date(kunjungan.tanggal).toLocaleDateString(
//                       "id-ID"
//                     )}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-5 mt-5">
//               <Input
//                 id="tinggiBadan"
//                 label="Tinggi Badan (cm)"
//                 type="number"
//                 placeholder="Masukkan Tinggi Badan Pasien (Contoh: 175)"
//                 validation={{ required: "Tinggi badan wajib diisi" }}
//               />
//               <Input
//                 id="beratBadan"
//                 label="Berat Badan (kg)"
//                 type="number"
//                 placeholder="Masukkan Berat Badan Pasien (Contoh: 45)"
//                 validation={{ required: "Berat badan wajib diisi" }}
//               />
//               <Input
//                 id="tensi"
//                 label="Tensi Darah (mmHg)"
//                 placeholder="Masukkan Tensi Darah Pasien (Contoh: 120/90)"
//                 validation={{ required: "Tensi darah wajib diisi" }}
//               />
//             </div>

//             <Typography variant="h5" weight="bold" className="mt-8">
//               Keluhan
//             </Typography>
//             {kunjungan && (
//               <div>
//                 <TextArea
//                   id="keluhan"
//                   label="Detail Keluhan"
//                   value={kunjungan.keluhan || ""}
//                   readOnly
//                 />
//               </div>
//             )}

//             <Typography variant="h5" weight="bold" className="mt-8">
//               Diagnosis
//             </Typography>
//             <TextArea
//               id="diagnosis"
//               label="Detail Diagnosis"
//               placeholder="Masukkan Hasil Diagnosis Pasien"
//               validation={{ required: "Diagnosis wajib diisi" }}
//             />

//             <Typography variant="h5" weight="bold" className="mt-8">
//               Obat
//             </Typography>
//             <div className="grid grid-cols-2 gap-5 items-center">
//               <SelectInput
//                 id="obatId"
//                 label="Nama Obat"
//                 placeholder="Pilih Obat"
//                 value={obatId} // Mengaitkan nilai ke state obatId
//                 onChange={handleObatChange} // Mengubah state ketika ada perubahan
//               >
//                 <option value="">-- Pilih Obat --</option>
//                 {obatList.map((obat) => (
//                   <option key={obat.id} value={obat.id}>
//                     {obat.namaObat} (Stok: {obat.totalStok})
//                   </option>
//                 ))}
//               </SelectInput>

//               <Input
//                 id="kuantitasObat"
//                 label="Kuantitas"
//                 type="number"
//                 placeholder="1"
//               />

//               <div className="col-span-2 flex justify-center mt-2">
//                 <Button type="button" onClick={handleAddObat}>
//                   + Tambah
//                 </Button>
//               </div>
//             </div>

//             {obatWithNames.length > 0 && (
//               <table className="table-auto w-full mt-5 border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="text-center bg-primary-1 text-white">
//                     <th className="border border-gray-300 p-2">No</th>
//                     <th className="border border-gray-300 p-2">Nama Obat</th>
//                     <th className="border border-gray-300 p-2">Kuantitas</th>
//                     <th className="border border-gray-300 p-2">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {obatWithNames.map((obat, index) => (
//                     <tr key={obat.id} className="text-center">
//                       <td className="border border-gray-300 p-2">
//                         {index + 1}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         {obat.namaObat}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         {obat.kuantitas}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         <div className="flex justify-center space-x-2">
//                           <Button
//                             type="button"
//                             className="shadow-none"
//                             onClick={() => handleEditObat(obat.id)}
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             type="button"
//                             className="shadow-none"
//                             onClick={() => handleRemoveObat(obat.id)}
//                           >
//                             Hapus
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}

//             <Typography variant="h5" weight="bold" className="mt-8">
//               Resep Obat
//             </Typography>
//             <TextArea
//               id="deskripsiResepObat"
//               label="Detail Resep Obat"
//               placeholder="Masukkan Resep Obat yang Dibutuhkan Pasien"
//             />

//             <Typography variant="h5" weight="bold" className="mt-8">
//               Rujukan
//             </Typography>
//             <div className="grid grid-cols-3 gap-5">
//               <Input
//                 id="tujuanRujukan"
//                 label="Rumah Sakit"
//                 placeholder="Masukkan Nama Rumah Sakit Rujukan"
//               />
//               <Input
//                 id="dokterRujukan"
//                 label="Dokter"
//                 placeholder="Masukkan Nama Dokter Rujukan"
//               />
//               <Input
//                 id="catatanRujukan"
//                 label="Catatan"
//                 placeholder="Masukkan Catatan Rujukan"
//               />
//             </div>

//             <div className="mt-5 flex items-center gap-4">
//               <Button type="submit">Simpan</Button>
//               <Link href="/home">
//                 <Button variant="danger">Batal</Button>
//               </Link>
//             </div>
//           </form>
//         </FormProvider>
//       </section>
//     </main>
//   );
// };

// export default withAuth(RekamMedisUpdatePage, "user");
