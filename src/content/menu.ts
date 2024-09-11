import { IconType } from "react-icons";
import { BiSolidHome } from "react-icons/bi";
import { FaBook } from "react-icons/fa";

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
    name: "Menu 1",
    icon: FaBook,
    href: "/menu-1",
    children: [
      {
        name: "Sub Menu 1",
        icon: FaBook,
        href: "/menu-1/sub-1",
        children: [],
      },
      {
        name: "Sub Menu 2",
        icon: FaBook,
        href: "/menu-1/sub-2",
        children: [],
      },
      {
        name: "Sub Menu 3",
        icon: FaBook,
        href: "/menu-1/sub-3",
        children: [],
      },
    ],
  },
  {
    name: "Menu 2",
    icon: FaBook,
    href: "/menu-2",
    children: [
      {
        name: "Sub Menu 1",
        icon: FaBook,
        href: "/menu-2/sub-1",
        children: [],
      },
      {
        name: "Sub Menu 2",
        icon: FaBook,
        href: "/menu-2/sub-2",
        children: [],
      },
      {
        name: "Sub Menu 3",
        icon: FaBook,
        href: "/menu-2/sub-3",
        children: [],
      },
    ],
  },
];
