import { useDocumentTitle } from "@/context/Title";
import clsxm from "@/lib/clsxm";
import { useRouter } from "next/router";
import DesktopSideNavbar from "./DesktopSideNavbar";
import DesktopTopNav from "./DesktopTopNav";
import MobileNav from "./MobileNav";

type AppShellProps = {
  children: React.ReactNode;
};

const disableNav = [
  "/404",
  "/403",
  "/500",
  "/login",
  "/notifikasi",
  "/kunjungan/surat-izin/[id]",
];

const AppShell = (props: AppShellProps) => {
  const { title } = useDocumentTitle();
  const router = useRouter();
  const pathname = router.pathname;

  const disable =
    disableNav.includes(pathname) ||
    pathname.startsWith("/sandbox") ||
    pathname === "/";

  const disableBg =
    pathname === "/pasien/detail/[id]" ||
    pathname === "/kunjungan/[id]" ||
    pathname === "/obat/permintaan-restock" ||
    pathname === "/obat/detail/[id]" ||
    pathname.startsWith("/dashboard");

  return (
    <section>
      <div className="md:flex md:flex-row-reverse">
        {!disable && (
          <>
            <DesktopSideNavbar className="max-md:hidden" />
            <MobileNav className="flex md:hidden" />
          </>
        )}
        <div
          className={clsxm(
            "",
            !disable
              ? "mt-[64px] md:mt-0 w-full md:w-[93%] overflow-x-hidden"
              : "w-full"
          )}
        >
          {!disable && <DesktopTopNav title={title} />}
          <div
            className={clsxm("min-h-[80vh]", !disable && !disableBg && "p-8")}
          >
            <div
              className={clsxm(
                !disableBg ? "bg-white md:rounded-xl md:shadow-xl" : "p-5",
                !disable ? "md:py-5 md:px-8" : ""
              )}
            >
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShell;
