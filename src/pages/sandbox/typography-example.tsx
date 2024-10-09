import Button from "@/components/elements/Button";
import Typography from "@/components/elements/Typography";
import Link from "next/link";
import { useState } from "react";

const TypographyExample = () => {
  const [isInter, setInter] = useState(true);

  return (
    <main className="min-h-screen w-full p-10">
      <Link href={"/sandbox"} className="w-fit">
        <Typography
          className="text-gray-500 hover:text-blue-400 w-fit"
          weight="semibold"
        >
          Back
        </Typography>
      </Link>
      <div className="flex justify-between">
        <Typography variant="h6">Typography</Typography>
        <Button onClick={() => setInter(!isInter)} fullRounded size="lg">
          Change to {isInter ? "Ubuntu" : "Inter"}
        </Button>
      </div>
      <div className="hidden lg:flex px-10 py-2 mt-5 justify-between items-center bg-gray-200 rounded-full w-full overflow-x-auto no-scrollbar">
        <Typography className="text-secondary-1">Primary</Typography>
        <Typography className="text-secondary-1">Secondary</Typography>
        <Typography className="text-secondary-1">Danger</Typography>
        <Typography className="text-secondary-1">Warning</Typography>
        <Typography className="text-secondary-1">Success</Typography>
        <Typography className="text-secondary-1">Netral</Typography>
      </div>
      <div className="mt-5 flex flex-wrap w-full justify-between items-center border-2 border-primary-1 rounded-lg">
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h1"
            className="text-primary-1"
          >
            H1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h2"
            className="text-primary-1"
          >
            H2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h3"
            className="text-primary-1"
          >
            H3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h4"
            className="text-primary-1"
          >
            H4
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h5"
            className="text-primary-1"
          >
            H5
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h6"
            className="text-primary-1"
          >
            H6
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h1"
            className="text-secondary-1"
          >
            H1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h2"
            className="text-secondary-1"
          >
            H2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h3"
            className="text-secondary-1"
          >
            H3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h4"
            className="text-secondary-1"
          >
            H4
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h5"
            className="text-secondary-1"
          >
            H5
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h6"
            className="text-secondary-1"
          >
            H6
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h1"
            className="text-danger-core"
          >
            H1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h2"
            className="text-danger-core"
          >
            H2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h3"
            className="text-danger-core"
          >
            H3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h4"
            className="text-danger-core"
          >
            H4
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h5"
            className="text-danger-core"
          >
            H5
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h6"
            className="text-danger-core"
          >
            H6
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h1"
            className="text-warning-core"
          >
            H1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h2"
            className="text-warning-core"
          >
            H2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h3"
            className="text-warning-core"
          >
            H3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h4"
            className="text-warning-core"
          >
            H4
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h5"
            className="text-warning-core"
          >
            H5
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h6"
            className="text-warning-core"
          >
            H6
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h1"
            className="text-success-core"
          >
            H1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h2"
            className="text-success-core"
          >
            H2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h3"
            className="text-success-core"
          >
            H3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h4"
            className="text-success-core"
          >
            H4
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h5"
            className="text-success-core"
          >
            H5
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h6"
            className="text-success-core"
          >
            H6
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h1"
            className="text-netral-1"
          >
            H1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h2"
            className="text-netral-1"
          >
            H2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h3"
            className="text-netral-1"
          >
            H3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h4"
            className="text-netral-1"
          >
            H4
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h5"
            className="text-netral-1"
          >
            H5
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="h6"
            className="text-netral-1"
          >
            H6
          </Typography>
        </div>
      </div>
      <div className="hidden lg:flex px-10 py-2 mt-5 justify-between items-center bg-gray-200 rounded-full w-full overflow-x-auto no-scrollbar">
        <Typography className="text-secondary-1">Light</Typography>
        <Typography className="text-secondary-1">Normal</Typography>
        <Typography className="text-secondary-1">Medium</Typography>
        <Typography className="text-secondary-1">Semibold</Typography>
        <Typography className="text-secondary-1">Bold</Typography>
      </div>
      <div className="mt-5 flex flex-wrap justify-between items-center border-2 border-primary-1 rounded-lg">
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p1"
            className="font-light"
          >
            P1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p2"
            className="font-light"
          >
            P2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p3"
            className="font-light"
          >
            P3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p4"
            className="font-light"
          >
            P4
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p1"
            className="font-normal"
          >
            P1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p2"
            className="font-normal"
          >
            P2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p3"
            className="font-normal"
          >
            P3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p4"
            className="font-normal"
          >
            P4
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p1"
            className="font-medium"
          >
            P1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p2"
            className="font-medium"
          >
            P2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p3"
            className="font-medium"
          >
            P3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p4"
            className="font-medium"
          >
            P4
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p1"
            className="font-semibold"
          >
            P1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p2"
            className="font-semibold"
          >
            P2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p3"
            className="font-semibold"
          >
            P3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p4"
            className="font-semibold"
          >
            P4
          </Typography>
        </div>
        <div className="mt-2 flex flex-col items-center gap-4 w-fit p-5 rounded-xl">
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p1"
            className="font-bold"
          >
            P1
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p2"
            className="font-bold"
          >
            P2
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p3"
            className="font-bold"
          >
            P3
          </Typography>
          <Typography
            font={isInter ? "inter" : "ubuntu"}
            variant="p4"
            className="font-bold"
          >
            P4
          </Typography>
        </div>
      </div>
    </main>
  );
};

export default TypographyExample;
