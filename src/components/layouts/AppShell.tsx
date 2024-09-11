import clsxm from "@/lib/clsxm";
import { useRouter } from "next/router";
import DesktopSideNavbar from "./DesktopSideNavbar";
import MobileNav from "./MobileNav";

type AppShellProps = {
  children: React.ReactNode;
};

const disableNav = ["/404", "/403", "/500"];

const AppShell = (props: AppShellProps) => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <section>
      <div className="lg:flex lg:flex-row-reverse">
        {!disableNav.includes(pathname) && (
          <>
            <DesktopSideNavbar className="hidden md:block" />
            <MobileNav className="flex md:hidden" />
          </>
        )}
        <div
          className={clsxm(
            "",
            !disableNav.includes(pathname)
              ? "mt-[64px] lg:mt-0 w-full lg:w-[93%]"
              : "w-full"
          )}
        >
          {props.children}
        </div>
      </div>
    </section>
  );
};

export default AppShell;
