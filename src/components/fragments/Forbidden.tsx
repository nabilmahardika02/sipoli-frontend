import Link from "next/link";
import { HiHome } from "react-icons/hi";
import Button from "../elements/Button";
import Typography from "../elements/Typography";

const Forbidden = () => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center">
      <Typography variant="h1" font="ubuntu" className="text-primary-1">
        403
      </Typography>
      <Typography variant="h6" weight="semibold" className="text-primary-2">
        Permission denied
      </Typography>
      <Link href={"/"} className="mt-3">
        <Button leftIcon={HiHome} fullRounded>
          Home
        </Button>
      </Link>
    </section>
  );
};

export default Forbidden;
