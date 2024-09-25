import { IconType } from "react-icons";
import { BiSolidHome } from "react-icons/bi";
import { FaBook, FaCapsules } from "react-icons/fa";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { MdSwitchAccount } from "react-icons/md";
import { VscGraphLine } from "react-icons/vsc";
import { MdOutlineSick } from "react-icons/md";

export type NavbarMenu = {
  name: string;
  href: string;
  icon: IconType;
  children: NavbarMenu[];
};

export const operatorMenu: NavbarMenu[] = [
  {
    name: "Home",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
  {
    name: "Daftar Akun",
    icon: MdSwitchAccount,
    href: "/akun",
    children: [],
  },
  {
    name: "Kunjungan",
    icon: FaPeopleCarryBox,
    href: "/kunjungan",
    children: [
      {
        name: "Daftar Kunjungan",
        icon: FaBook,
        href: "/kunjungan/all",
        children: [],
      },
      {
        name: "Dashboard Kunjungan",
        icon: VscGraphLine,
        href: "/kunjungan/dashboard",
        children: [],
      },
    ],
  },
  {
    name: "Obat",
    icon: FaCapsules,
    href: "/obat",
    children: [
      {
        name: "Daftar Obat",
        icon: FaCapsules,
        href: "/obat/all",
        children: [],
      },
      {
        name: "Dashboard Obat",
        icon: VscGraphLine,
        href: "/obat/dashboard",
        children: [],
      },
    ],
  },
];

export const pasienMenu: NavbarMenu[] = [
  {
    name: "Home",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
  {
    name: "Rekam Medis",
    icon: FaBook,
    href: "/rekam-medis",
    children: [],
  },
];

export const dokterMenu: NavbarMenu[] = [
  {
    name: "Home",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
  {
    name: "Daftar Kunjungan",
    icon: FaBook,
    href: "/kunjungan",
    children: [],
  },
  {
    name: "Daftar Obat",
    icon: FaCapsules,
    href: "/obat",
    children: [],
  },
  {
    name: "Dashboard",
    icon: VscGraphLine,
    href: "/dashboard",
    children: [],
  },
];

export const perawatMenu: NavbarMenu[] = [
  {
    name: "Home",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
  {
    name: "Daftar Kunjungan",
    icon: FaBook,
    href: "/kunjungan",
    children: [],
  },
  {
    name: "Daftar Obat",
    icon: FaCapsules,
    href: "/obat",
    children: [],
  },
  {
    name: "Daftar Pasien",
    icon: MdOutlineSick,
    href: "/pasien",
    children: [],
  },
  {
    name: "Dashboard",
    icon: VscGraphLine,
    href: "/dashboard",
    children: [],
  },
];

export const defaultMenu: NavbarMenu[] = [
  {
    name: "Home",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
];
