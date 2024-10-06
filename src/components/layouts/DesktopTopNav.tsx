import { FaBell, FaUserCircle } from "react-icons/fa";
import Typography from "../elements/Typography";
import useAuthStore from "@/store/useAuthStore";

const DesktopTopNav = ({ title = "Home" }: { title?: string }) => {
  const user = useAuthStore.useUser();
  return (
    <nav className="hidden md:block w-full px-8 pt-2">
      <div className="w-full shadow-lg px-5 py-2 rounded-lg flex items-center justify-between bg-white">
        <Typography variant="h6" className="text-primary-1" font="ubuntu">
          {title}
        </Typography>
        <div className="flex items-center gap-3">
          <button className="text-xl text-primary-1 hover:text-primary-2">
            {(user?.role === "DOKTER" || user?.role === "PERAWAT") && <FaBell />
            }
          </button>
          <button className="text-xl text-primary-1 hover:text-primary-2">
            <FaUserCircle />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DesktopTopNav;
