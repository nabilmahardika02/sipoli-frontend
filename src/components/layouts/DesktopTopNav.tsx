import useAuthStore from "@/store/useAuthStore";
import { FaBell, FaUserCircle } from "react-icons/fa";
import Typography from "../elements/Typography";
import Link from "next/link";

const DesktopTopNav = ({ title = "Beranda" }: { title?: string }) => {
  const user = useAuthStore.useUser();
  return (
    <nav className="hidden md:block w-full px-8 pt-2">
      <div className="w-full shadow-lg px-5 py-2 rounded-lg flex items-center justify-between bg-white">
        <Typography variant="h6" className="text-primary-1" font="ubuntu">
          {title}
        </Typography>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <Typography variant="p1" className="text-primary-1" font="ubuntu">
              {user?.name || "Guest"} - {user?.role || "Role"}{" "}
              {/* Display user's role */}
            </Typography>
          </div>
          <button className="text-xl text-primary-1 hover:text-primary-2">
            {(user?.role === "DOKTER" || user?.role === "PERAWAT") && (
              <FaBell />
            )}
          </button>
          <Link href={"/akun/me"}>
          <button className="text-xl text-primary-1 hover:text-primary-2">
            <FaUserCircle />
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DesktopTopNav;
