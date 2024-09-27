import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import Head from "next/head";
import Link from "next/link";

const Error404 = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <Head>
        <title>404</title>
      </Head>
      <Typography variant="h1" font="ubuntu" className="text-primary-1">
        404
      </Typography>
      <Typography variant="h5" className="text-primary-2">
        Page not found
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

export default Error404;
