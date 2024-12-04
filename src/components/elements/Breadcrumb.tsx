import React from "react";

// Breadcrumb buat create hasil pemeriksaan

const Breadcrumb = ({
  currentStep,
  totalSteps,
  onNavigate,
}: {
  currentStep: number;
  totalSteps: number;
  onNavigate: (step: number) => void;
}) => {
  const stepTitles = [
    "Data Kunjungan",
    "Pemeriksaan Fisik",
    "Status Present",
    "Diagnosa Akhir",
    "Resep Obat",
    "Rujukan",
  ];

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        return (
          <div className="relative group" key={index}>
            <button
              onClick={() => onNavigate(step)}
              className={`w-9 h-9 flex items-center justify-center rounded text-white text-m font-semibold ${
                step === currentStep
                  ? "bg-primary-1 cursor-default"
                  : "bg-secondary-5 hover:bg-primary-3 cursor-pointer"
              }`}
            >
              {step}
            </button>
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary-3 text-white text-xs rounded px-2 py-1">
              {stepTitles[index]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;



