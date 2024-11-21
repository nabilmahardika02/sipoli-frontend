import {
  defaultMenu,
  dokterMenu,
  operatorMenu,
  pasienMenu,
  perawatMenu,
} from "@/content/menu";
import clsxm from "@/lib/clsxm";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import Logo from "../elements/Logo";
import Typography from "../elements/Typography";
import SubNav from "./SubNav";
import { FaBell } from "react-icons/fa";
import sendRequest from "@/lib/getApi";

const MobileNav = ({ className }: { className?: string }) => {
  const [isOpen, setOpen] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const user = useAuthStore.useUser();
  const getMenu = (role: string) => {
    switch (role) {
      case "OPERATOR":
        return operatorMenu;
      case "DOKTER":
        return dokterMenu;
      case "PERAWAT":
        return perawatMenu;
      case "PASIEN":
        return pasienMenu;
      default:
        return defaultMenu;
    }
  };

  const [showSubnav, setShowSubNav] = useState<boolean[]>(
    new Array(getMenu(user?.role || "DEFAULT").length).fill(false)
  );

  const handleOpen = () => {
    setOpen(true);
    setVisible(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setVisible(false);
      setShowSubNav(
        new Array(getMenu(user?.role || "DEFAULT").length).fill(false)
      );
    }, 200);
  };

  const toggleMenuState = (index: number) => {
    setShowSubNav((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const isNewNotif = useAuthStore.useIsNewNotif();
  const setIsNotif = useAuthStore.useSetIsNotif();

  const fetchData = useCallback(async () => {
    const [responseData, message, isSuccess] = await sendRequest(
      "get",
      "notifikasi/is-exist"
    );

    console.log(responseData);
    if (isSuccess) {
      setIsNotif(responseData as boolean);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "DOKTER" || user?.role === "PERAWAT") {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 60000); // 1 minute in milliseconds

      return () => clearInterval(interval);
    }
  }, [user, fetchData]);

  return (
    <>
      <nav
        className={clsxm(
          "h-[64px] bg-primary-1 px-5 py-4 fixed top-0 left-0 w-full flex justify-between items-center shadow-md z-30",
          className
        )}
      >
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          {(user?.role === "DOKTER" || user?.role === "PERAWAT") && (
            <button className={clsxm("text-xl relative text-white")}>
              <FaBell />
              {isNewNotif && (
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 absolute top-0 left-0"></div>
              )}
            </button>
          )}
          <button
            className="text-white text-2xl active:rotate-90 active:transition-all active:duration-300"
            onClick={isOpen ? handleClose : handleOpen}
          >
            {isOpen ? <IoClose /> : <RxHamburgerMenu />}
          </button>
        </div>
      </nav>
      {isVisible && (
        <>
          <div className="w-full h-[calc(100vh-64px)] bg-black md:hidden fixed bottom-0 left-0 bg-opacity-30 z-30">
            <div
              className={clsxm(
                "w-[70%] bg-white right-0 h-[calc(100vh-64px)] fixed bottom-0",
                isOpen ? "fade-in-right" : "fade-out-left"
              )}
            >
              <ul className="flex flex-col w-full py-4 items-center">
                {user &&
                  getMenu(user.role).map((menu, index) =>
                    menu.children.length ? (
                      <div key={menu.href} className="w-full">
                        <button
                          className={clsxm(
                            "parent-nav py-4 w-full group flex px-4 items-center justify-between",
                            showSubnav[index]
                              ? "active-subnav"
                              : "inactive-subnav"
                          )}
                          key={menu.href}
                          onClick={() => toggleMenuState(index)}
                        >
                          <div className="flex items-center gap-2">
                            <menu.icon className="menu-icon text-primary-1 text-xl" />

                            <Typography
                              variant="p2"
                              font="ubuntu"
                              className="menu-title text-primary-1"
                            >
                              {menu.name}
                            </Typography>
                          </div>
                          <MdKeyboardArrowLeft className="subnav-arrow text-primary-1 text-xl" />
                        </button>
                        <SubNav
                          childMenu={menu.children}
                          className={
                            showSubnav[index]
                              ? "block fade-in-down-menu"
                              : "hidden fade-out-up-menu"
                          }
                        />
                      </div>
                    ) : (
                      <Link
                        href={menu.href}
                        className={clsxm(
                          "py-4 w-full group flex px-4 items-center justify-start"
                        )}
                        key={menu.href}
                      >
                        <div className="flex items-center gap-2">
                          <menu.icon className="menu-icon text-primary-1 text-xl group-active:text-primary" />
                          {isVisible && (
                            <Typography
                              variant="p2"
                              font="ubuntu"
                              className="text-primary-1 group-active:text-primary"
                            >
                              {menu.name}
                            </Typography>
                          )}
                        </div>
                      </Link>
                    )
                  )}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;
