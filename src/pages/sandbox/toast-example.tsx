import Button from "@/components/elements/Button";
import {
  DANGER_TOAST,
  showToast,
  SUCCESS_TOAST,
  WARNING_TOAST,
} from "@/components/elements/Toast";
import Typography from "@/components/elements/Typography";
import Link from "next/link";

const ToastExample = () => {
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
      <div className="mt-2 flex items-center gap-4 w-fit p-5 rounded-xl border-2 border-primary-1">
        <Button onClick={() => showToast("This is example of default toast")}>
          Click Me!
        </Button>
        <Button
          onClick={() =>
            showToast("This is example of success toast", SUCCESS_TOAST)
          }
          variant="secondary"
        >
          Click Me!
        </Button>
        <Button
          onClick={() =>
            showToast("This is example of danger toast", DANGER_TOAST)
          }
          variant="danger"
        >
          Click Me!
        </Button>
        <Button
          onClick={() =>
            showToast("This is example of warning toast", WARNING_TOAST)
          }
          variant="warning"
        >
          Click Me!
        </Button>
      </div>
    </main>
  );
};

export default ToastExample;
