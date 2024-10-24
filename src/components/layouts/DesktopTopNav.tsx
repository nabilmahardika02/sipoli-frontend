import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { FaBell, FaUserCircle } from "react-icons/fa";
import Typography from "../elements/Typography";

const DesktopTopNav = ({ title = "Beranda" }: { title?: string }) => {
  const user = useAuthStore.useUser();
  return (
    <nav className="hidden md:block w-full px-8 pt-2">
      <div className="w-full shadow-lg px-5 py-2 rounded-lg flex items-center justify-between bg-white">
        <Typography variant="h6" className="text-primary-1" font="ubuntu">
          {title}
        </Typography>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="">
                <Typography
                  variant="p3"
                  className="text-primary-1"
                  font="ubuntu"
                  weight="medium"
                >
                  {user.name || "Guest"} - {user.role || "Role"}
                </Typography>
              </div>
              {(user.role === "DOKTER" || user.role === "PERAWAT") && (
                <button className="text-xl text-primary-1 hover:text-primary-2">
                  <FaBell />
                </button>
              )}
            </>
          )}
          <Link href={"/akun/me"} className="leading-none">
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
