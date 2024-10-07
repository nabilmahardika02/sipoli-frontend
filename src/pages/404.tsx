import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Error404 = () => {
  const router = useRouter();

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <Head>
        <title>404</title>
      </Head>
      <Typography variant="h1" className="text-primary-1 font-mono">
        404
      </Typography>
      <Typography variant="h5" className="text-primary-2">
        Page not found
      </Typography>
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          className="mt-5"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Link href={"/"}>
          <Button className="mt-5">Home</Button>
        </Link>
      </div>
    </main>
  );
};

export default Error404;
