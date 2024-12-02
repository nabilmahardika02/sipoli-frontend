import React from "react";

const Breadcrumb = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-sm ${
            index + 1 <= currentStep ? "bg-primary-1" : "bg-gray-300"
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
