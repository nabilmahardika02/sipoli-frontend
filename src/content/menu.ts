import { IconType } from "react-icons";
import { BiSolidHome } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { MdSwitchAccount } from "react-icons/md";
import { FaCapsules } from "react-icons/fa";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { VscGraphLine } from "react-icons/vsc";

export type NavbarMenu = {
  name: string;
  href: string;
  icon: IconType;
  children: NavbarMenu[];
};

export const navbarMenus: NavbarMenu[] = [
  {
    name: "Home",
    icon: BiSolidHome,
    href: "/",
    children: [],
  },
  {
    name: "Daftar Akun",
    icon: MdSwitchAccount,
    href: "/menu-1",
    children: [],
  },
  {
    name: "Kunjungan",
    icon: FaPeopleCarryBox,
    href: "/menu-2",
    children: [
      {
        name: "Daftar Kunjungan",
        icon: FaBook,
        href: "/menu-2/sub-1",
        children: [],
      },
      {
        name: "Dashboard Kunjungan",
        icon: VscGraphLine,
        href: "/menu-2/sub-2",
        children: [],
      }
    ],
  },
  {
    name: "Obat",
    icon: FaCapsules,
    href: "/menu-2",
    children: [
      {
        name: "Daftar Obat",
        icon: FaBook,
        href: "/menu-2/sub-1",
        children: [],
      },
      {
        name: "Dashboard Obat",
        icon: VscGraphLine,
        href: "/menu-2/sub-2",
        children: [],
      }
    ],
  },
  
];
