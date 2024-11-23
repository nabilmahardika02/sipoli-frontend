import Typography from "@/components/elements/Typography";
import clsxm from "@/lib/clsxm";

const StatisticJumlahPasien = ({ className = "" }: { className?: string }) => {
  return (
    <section className={clsxm("data-section", className)}>
      <Typography variant="h6" className="text-primary-1">
        Data Pasien
      </Typography>
    </section>
  );
};

export default StatisticJumlahPasien;
