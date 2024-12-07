import { toast, ToastBar, Toaster, ToastOptions } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiSolidBadgeCheck, BiSolidError } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";

let loadingToastId: string | null = null;

export default function Toast() {
  return (
    <div>
      <Toaster
        reverseOrder={false}
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#E8F0E0",
            color: "#8AB364",
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button
                    className="rounded-full p-1 ring-blue-400 transition hover:bg-[#444] hover:bg-opacity-20 focus:outline-none focus-visible:ring"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <HiX />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  );
}

export const DEFAULT_TOAST: ToastOptions = {
  style: {
    background: "#f3f4f6",
    color: "#475569",
  },
  icon: <RiErrorWarningLine />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 4000,
};

export const createCustomToast = (options: ToastOptions) => {
  return { ...DEFAULT_TOAST, ...options };
};

export const showToast = (
  message: string,
  options?: ToastOptions,
  title?: string
) => {
  return toast(message, options || DEFAULT_TOAST);
};

export const showLoadingToast = () => {
  if (!loadingToastId) {
    loadingToastId = toast("Loading...", LOADING_TOAST);
  }
};

export const dismissLoadingToast = () => {
  if (loadingToastId) {
    toast.dismiss(loadingToastId);
    loadingToastId = null;
  }
};

export const LOADING_TOAST = createCustomToast({
  style: {
    background: "#f3f4f6",
    color: "#475569",
  },
  icon: <AiOutlineLoading3Quarters className="animate-spin" />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: Infinity,
});

export const SUCCESS_TOAST = createCustomToast({
  style: {
    background: "#4CC88e",
    color: "#ffffff",
  },
  icon: <BiSolidBadgeCheck size={20} />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 4000,
});

export const DANGER_TOAST = createCustomToast({
  style: {
    background: "#ff4949",
    color: "#ffffff",
  },
  icon: <MdErrorOutline size={20} />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 4000,
});

export const WARNING_TOAST = createCustomToast({
  style: {
    background: "#ffc700",
    color: "#ffffff",
  },
  icon: <BiSolidError size={20} />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 4000,
});

export const KUNJUNGAN_TOAST = createCustomToast({
  style: {
    background: "#60a5fa",
    color: "#ffffff",
  },
  icon: <FaInfoCircle size={20} />,
  className: "w-[375px] [&>div]:justify-start",
  position: "bottom-right",
  duration: 10000,
});
