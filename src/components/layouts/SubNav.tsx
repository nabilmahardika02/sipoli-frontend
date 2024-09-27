import { NavbarMenu } from "@/content/menu";
import clsxm from "@/lib/clsxm";
import Link from "next/link";
import Typography from "../elements/Typography";

const SubNav = ({
  childMenu,
  className,
}: {
  childMenu: NavbarMenu[];
  className?: string;
}) => {
  return (
    <ul className={clsxm("subnav w-full pl-5", className)}>
      {childMenu.map((menu, index) => (
        <Link
          href={menu.href}
          className={clsxm("py-2 w-full group flex px-4 items-center")}
          key={menu.href}
        >
          <div className="flex items-center gap-2">
            <menu.icon className="text-primary-1 md:text-white group-hover:text-success-3 text-xl" />

            <Typography
              variant="p2"
              font="ubuntu"
              className="text-primary-1 md:text-white group-hover:text-success-3"
            >
              {menu.name}
            </Typography>
          </div>
        </Link>
      ))}
    </ul>
  );
};

export default SubNav;
