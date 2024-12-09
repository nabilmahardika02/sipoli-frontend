import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { UsernameForm } from "@/types/forms/authForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { RegisterOptions } from "react-hook-form";
import { User } from "@/types/entities/user";

const usernameValidation: RegisterOptions = {
  required: "Username wajib diisi",
  minLength: { value: 6, message: "Minimal 6 karakter" },
  maxLength: { value: 30, message: "Minimal 30 karakter" },
  pattern: {
    value: /^[A-Za-z0-9_]*$/,
    message: "Username hanya dapat berisi huruf, angka, dan underscore",
  },
  validate: {
    startsWithLetter: (value) => {
      if (!value) return true;
      const firstChar = value.charAt(0);
      return (
        /[A-Za-z]/.test(firstChar) || "Username harus dimulai dengan huruf"
      );
    },
  },
};

const ChangeUsernamePage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Ubah Username");
  }, [setTitle]);

  const user = useAuthStore.useUser();
  const setChangedUser = useAuthStore.useSetChangedUser();

  const router = useRouter();
  const methods = useForm<UsernameForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<UsernameForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "auth/change-username",
        data,
        true
      );

      if (isSuccess) {
        const [responseDataProfile, messageProfile, isSuccessProfile] =
          await sendRequest("get", "/profile/me", null);

        const user = responseDataProfile as User;

        setChangedUser(user);
        console.log(user);

        router.push(`/akun/me`);
      }
    };
    postData();
  };

  useEffect(() => {
    if (user?.username != null) {
      methods.setValue("username", user.username);
    }
  }, [user?.username, methods]);

  return (
    <main>
      <section className="mb-5">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="username"
                validation={usernameValidation}
                label="Username Baru"
              />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Kirim</Button>
              <Link href={`/akun/me`}>
                <Button variant="danger">Batal</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(ChangeUsernamePage, "user");
