import withAuth from "@/components/hoc/withAuth";
import { useRouter } from "next/router"; // Import useRouter for navigation
import { useEffect } from "react";

const KunjunganPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
};

export default withAuth(KunjunganPage, "user");
