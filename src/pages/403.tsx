import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import Head from "next/head";
import Link from "next/link";

const Error403 = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <Head>
        <title>403</title>
      </Head>
      <Typography variant="h1" font="ubuntu" className="text-primary-1">
        403
      </Typography>
      <Typography variant="h5" className="text-primary-2">
        You dont have permission to access this page
      </Typography>
      <div>
        <Link href={"/"}>
          <Button className="mt-5" fullRounded>
            Home
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default Error403;
