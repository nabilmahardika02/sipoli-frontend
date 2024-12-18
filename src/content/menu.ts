import { IconType } from "react-icons";
import { BiSolidHome } from "react-icons/bi";
import { FaBook, FaCapsules } from "react-icons/fa";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { MdOutlineSick, MdSwitchAccount } from "react-icons/md";
import { VscGraphLine } from "react-icons/vsc";

export type NavbarMenu = {
  name: string;
  href: string;
  icon: IconType;
  children: NavbarMenu[];
};

export const operatorMenu: NavbarMenu[] = [
  {
    name: "Beranda",
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
        href: "/obat",
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
    name: "Beranda",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
  {
    name: "Hasil Pemeriksaan",
    icon: FaBook,
    href: "/rekam-medis/all",
    children: [],
  },
];

export const dokterMenu: NavbarMenu[] = [
  {
    name: "Beranda",
    icon: BiSolidHome,
    href: "/home",
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
        href: "/obat",
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

export const perawatMenu: NavbarMenu[] = [
  {
    name: "Beranda",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
  {
    name: "Daftar Pasien",
    icon: MdOutlineSick,
    href: "/pasien",
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
        href: "/obat",
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

export const defaultMenu: NavbarMenu[] = [
  {
    name: "Beranda",
    icon: BiSolidHome,
    href: "/home",
    children: [],
  },
];
