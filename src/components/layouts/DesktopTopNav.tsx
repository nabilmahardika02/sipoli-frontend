import clsxm from "@/lib/clsxm";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { KUNJUNGAN_TOAST, showToast } from "../elements/Toast";
import Typography from "../elements/Typography";

const DesktopTopNav = ({ title = "Beranda" }: { title?: string }) => {
  const user = useAuthStore.useUser();
  const isNewNotif = useAuthStore.useIsNewNotif();
  const setIsNotif = useAuthStore.useSetIsNotif();

  const fetchData = useCallback(async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      "notifikasi/is-exist"
    );

    if (isSuccess) {
      const data = responseData as NewNotifikasiResponse;
      setIsNotif(data.isExists);

      data.newNotifications.forEach((notifikasi, i) => {
        showToast(
          notifikasi.title + "\n" + notifikasi.message,
          KUNJUNGAN_TOAST
        );
      });
    }
  }, []);

  useEffect(() => {
    if (user?.role === "DOKTER" || user?.role === "PERAWAT") {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user, fetchData]);

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
                <Link href={"/notifikasi"}>
                  <button
                    className={clsxm(
                      "text-xl relative text-primary-1 hover:text-primary-2"
                    )}
                  >
                    <FaBell />
                    {isNewNotif && (
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400 absolute top-0 left-0"></div>
                    )}
                  </button>
                </Link>
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
