import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import Typography from "@/components/elements/Typography";
import withAuth from "@/components/hoc/withAuth";
import { setToken } from "@/lib/cookies";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { User } from "@/types/entities/user";
import { LoginForm } from "@/types/forms/authForm";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { CiLogin } from "react-icons/ci";

const LoginPage = () => {
  const router = useRouter();
  const login = useAuthStore.useLogin();
  const methods = useForm<LoginForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const getDefaultRoute = (role: string): string => {
    switch (role) {
      case "OPERATOR":
        return "/home";
      case "PASIEN":
        return "/home";
      default:
        return "/";
    }
  };

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "post",
        "auth/login",
        data,
        true
      );

      if (isSuccess) {
        setToken(responseData as string);

        const [responseDataProfile, messageProfile, isSuccessProfile] =
          await sendRequest("get", "/profile/me", null);

        const user = responseDataProfile as User;

        login({
          token: responseData as string,
          ...user,
        });

        router.push(getDefaultRoute(user.role));
      }
    };

    postData();
  };

  return (
    <main className="w-full h-screen bg-neutral-100 md:bg-transparent flex items-center justify-center">
      <div className="h-screen w-[50%] bg-primary-1 hidden md:flex md:flex-col items-center justify-center">
        <div className="relative w-[50%] aspect-square">
          <Image
            src={"/images/logo.png"}
            fill
            className="w-full h-auto"
            objectFit="contain"
            width={0}
            height={0}
            sizes="100vw"
            alt="Logo"
          />
        </div>
        <Typography
          variant="h4"
          className="text-white text-center"
          font="josefins"
        >
          Balai Diklat PKN Bali
        </Typography>
        <Typography variant="p1" className="text-white text-center">
          Badan Pemeriksa Keuangan RI
        </Typography>
      </div>
      <div className="w-[85%] md:w-[50%] bg-white rounded-xl shadow-xl md:shadow-none p-5 md:p-10">
        <Typography variant="h5" className="text-primary-1 mx-auto md:mx-0">
          Selamat Datang,
        </Typography>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-2"
          >
            <Input
              id="username"
              validation={{ required: "Username wajib diisi" }}
              placeholder="Username"
              label="Username"
            />
            <Input
              id="password"
              validation={{ required: "Password wajib diisi" }}
              placeholder="*******"
              label="Password"
              type="password"
            />
            <Button
              type="submit"
              className="mt-3 mx-auto md:mx-0"
              rightIcon={CiLogin}
            >
              Login
            </Button>
          </form>
          <div className="flex items-center flex-wrap gap-1">
            <Typography variant="p3" className="mt-5">
              Lupa password?
            </Typography>
            <Link
              href={
                "https://wa.me/62888888888?text=Halo%20Admin,%20Saya%20lupa%20password"
              }
              target="_blank"
            >
              <Typography
                variant="p3"
                className="mt-5 hover:text-blue-500"
                weight="medium"
              >
                Hubungi Admin
              </Typography>
            </Link>
          </div>
        </FormProvider>
      </div>
    </main>
  );
};

export default withAuth(LoginPage, "public");
