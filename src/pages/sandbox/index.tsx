import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import Link from "next/link";

const SandboxPage = () => {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center gap-5">
      <Typography variant="h1" font="ubuntu">
        Sandbox
        <span className="text-xl ml-4">by Mazaya</span>
      </Typography>
      <div className="flex flex-wrap gap-4 items-center justify-center w-[90%] md:w-[60%]">
        <Link href={"/sandbox/typography-example"}>
          <Button variant="outline">Typography</Button>
        </Link>
        <Link href={"/sandbox/button-example"}>
          <Button>Button</Button>
        </Link>
        <Link href={"/sandbox/toast-example"}>
          <Button variant="secondary">Toast</Button>
        </Link>
        <Link href={"/sandbox/input-example"}>
          <Button variant="warning">Input</Button>
        </Link>
        <Link href={"/sandbox/datetimepicker-example"}>
          <Button variant="secondary">Datetime Picker</Button>
        </Link>
      </div>
    </main>
  );
};

export default SandboxPage;
