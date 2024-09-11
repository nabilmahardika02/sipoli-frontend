import { navbarMenus } from "@/content/menu";
import clsxm from "@/lib/clsxm";
import Link from "next/link";
import { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Logo from "../elements/Logo";
import Typography from "../elements/Typography";
import SubNav from "./SubNav";

const DesktopSideNavbar = ({ className }: { className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [showSubnav, setShowSubNav] = useState<boolean[]>(
    new Array(navbarMenus.length).fill(false)
  );

  const handleHover = () => {
    setIsHovered(true);
    setTimeout(() => {
      setVisible(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setVisible(false);
    setShowSubNav(new Array(navbarMenus.length).fill(false));
  };

  const toggleMenuState = (index: number) => {
    setShowSubNav((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <aside
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      className={clsxm(
        "fixed top-0 left-0 w-[7%] hover:w-[20%] transition-all duration-400 h-screen bg-primary shadow-lg py-5",
        className
      )}
    >
      <Link href={"/"}>
        <Logo className="mx-auto" />
      </Link>

      <ul className="flex flex-col gap-5 w-full mt-10 py-4 items-center overflow-y-auto no-scrollbar">
        {navbarMenus.map((menu, index) =>
          menu.children.length ? (
            <div key={menu.href} className="w-full">
              <button
                className={clsxm(
                  "parent-nav py-2 w-full group flex px-4 items-center",
                  isHovered ? "justify-between" : "justify-center",
                  showSubnav[index] ? "active-subnav" : "inactive-subnav"
                )}
                key={menu.href}
                onClick={() => toggleMenuState(index)}
              >
                <div className="flex items-center gap-2">
                  <menu.icon className="menu-icon text-white group-hover:text-green-200 text-xl" />
                  {isVisible && isHovered && (
                    <Typography
                      variant="p2"
                      font="ubuntu"
                      className="menu-title text-white group-hover:text-green-200"
                    >
                      {menu.name}
                    </Typography>
                  )}
                </div>
                {isHovered && (
                  <MdKeyboardArrowLeft className="subnav-arrow text-white group-hover:text-green-200 text-xl" />
                )}
              </button>
              <SubNav
                childMenu={menu.children}
                className={
                  isHovered && showSubnav[index]
                    ? "block fade-in-down-menu"
                    : "hidden fade-out-up-menu"
                }
              />
            </div>
          ) : (
            <Link
              href={menu.href}
              className={clsxm(
                "py-2 w-full group flex px-4 items-center",
                isHovered ? "justify-start" : "justify-center"
              )}
              key={menu.href}
            >
              <div className="flex items-center gap-2">
                <menu.icon className="menu-icon text-white group-hover:text-green-200 text-xl" />
                {isVisible && isHovered && (
                  <Typography
                    variant="p2"
                    font="ubuntu"
                    className="text-white group-hover:text-green-200"
                  >
                    {menu.name}
                  </Typography>
                )}
              </div>
            </Link>
          )
        )}
      </ul>
    </aside>
  );
};

export default DesktopSideNavbar;
