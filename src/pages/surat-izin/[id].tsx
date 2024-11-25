import Typography from "@/components/elements/Typography";

const SuratIzinPage = () => {
  return (
    <main className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-sm">
      <Typography variant="h4" className="mb-4 text-center">
        Surat Keterangan Sakit
      </Typography>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md shadow">
          <Typography>
            Diberikan istirahat sakit selama <strong>1 hari</strong> terhitung
            mulai tanggal <strong>7 November 2024</strong> s.d tanggal{" "}
            <strong>7 November 2024</strong>
          </Typography>
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow">
          <Typography>
            <strong>Diagnosis Kerja:</strong> MCU
          </Typography>
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow">
          <Typography>
            <strong>Diagnosa ICD10:</strong> [Z000] General medical examination
            / General medical examination
          </Typography>
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow flex items-center justify-between">
          <Typography>
            <strong>Masa aktif dokumen:</strong> Kadaluwarsa
          </Typography>
          <span className="text-red-500 text-xl">✘</span>
        </div>
      </div>
    </main>
  );
};

export default SuratIzinPage;
