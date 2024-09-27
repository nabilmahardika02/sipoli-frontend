import Button from "@/components/elements/Button";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import { TiHome } from "react-icons/ti";

const ButtonExample = () => {
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
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-screen justify-center w-fit p-5 rounded-xl border-2 border-primary-1">
        <div className="flex flex-col gap-4 place-items-center">
          {/* Contoh pemanggilan button normal */}
          <Button>Hello World</Button>
          <Button variant="secondary">Hello World</Button>
          <Button variant="danger">Hello World</Button>
          <Button variant="warning">Hello World</Button>
          <Button variant="success">Hello World</Button>
          <Button variant="outline">Hello World</Button>
        </div>

        <div className="flex flex-col gap-4 place-items-center">
          {/* Contoh pemanggilan button with left icon */}
          <Button leftIcon={TiHome}>Hello World</Button>
          <Button leftIcon={TiHome} variant="secondary">
            Hello World
          </Button>
          <Button leftIcon={TiHome} variant="danger">
            Hello World
          </Button>
          <Button leftIcon={TiHome} variant="warning">
            Hello World
          </Button>
          <Button leftIcon={TiHome} variant="success">
            Hello World
          </Button>
          <Button leftIcon={TiHome} variant="outline">
            Hello World
          </Button>
        </div>

        <div className="flex flex-col gap-4 place-items-center">
          {/* Contoh pemanggilan button with right icon */}
          <Button rightIcon={MdClose}>Hello World</Button>
          <Button rightIcon={MdClose} variant="secondary">
            Hello World
          </Button>
          <Button rightIcon={MdClose} variant="danger">
            Hello World
          </Button>
          <Button rightIcon={MdClose} variant="warning">
            Hello World
          </Button>
          <Button rightIcon={MdClose} variant="success">
            Hello World
          </Button>
          <Button rightIcon={MdClose} variant="outline">
            Hello World
          </Button>
        </div>

        <div className="flex flex-col gap-4 place-items-center">
          {/* Contoh pemanggilan button small */}
          <Button size="sm">Hello World</Button>
          <Button size="sm" variant="secondary">
            Hello World
          </Button>
          <Button size="sm" variant="danger">
            Hello World
          </Button>
          <Button size="sm" variant="warning">
            Hello World
          </Button>
          <Button size="sm" variant="success">
            Hello World
          </Button>
          <Button size="sm" variant="outline">
            Hello World
          </Button>
        </div>

        {/* Contoh Icon Button: Wajib pakai Icon*/}
        <div className="flex flex-col gap-4 place-items-center">
          <div className="flex items-center gap-3">
            <IconButton size="sm" icon={TiHome} />
            <IconButton icon={TiHome} />
            <IconButton size="lg" icon={TiHome} />
          </div>
          <div className="flex items-center gap-3">
            <IconButton variant="secondary" size="sm" icon={TiHome} />
            <IconButton variant="secondary" icon={TiHome} />
            <IconButton variant="secondary" size="lg" icon={TiHome} />
          </div>
          <div className="flex items-center gap-3">
            <IconButton variant="outline" size="sm" icon={TiHome} />
            <IconButton variant="outline" icon={TiHome} />
            <IconButton variant="outline" size="lg" icon={TiHome} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ButtonExample;
