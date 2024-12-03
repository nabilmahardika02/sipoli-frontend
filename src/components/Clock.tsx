import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import Typography from "./elements/Typography";

const Clock = ({ isVisible = false }: { isVisible?: boolean }) => {
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  useEffect(() => {
    const updateTime = () => {
      const currentTime = DateTime.now().setZone("Asia/Makassar");
      setHours(currentTime.toFormat("HH"));
      setMinutes(currentTime.toFormat("mm"));
      setSeconds(currentTime.toFormat("ss"));
    };

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 justify-center">
      <Typography
        className="bg-white/50 font-mono text-primary-1 p-1 rounded-md"
        weight="semibold"
      >
        {hours}
      </Typography>
      <Typography className="text-white" weight="semibold">
        :
      </Typography>
      <Typography
        className="bg-white/50 font-mono text-primary-1 p-1 rounded-md"
        weight="semibold"
      >
        {minutes}
      </Typography>
    </div>
  );
};

export default Clock;
