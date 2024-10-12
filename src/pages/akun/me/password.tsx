import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MyPasswordForm } from "@/types/forms/authForm";
import sendRequest from "@/lib/getApi";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import Link from "next/link";

const ChangePasswordPage = () => {
  const { setTitle } = useDocumentTitle();

  useEffect(() => {
    setTitle("Ubah Password");
  }, [setTitle]);

  const router = useRouter();
  const methods = useForm<MyPasswordForm>({
    mode: "onTouched",
  });

  const { handleSubmit, watch } = methods;

  const oldPassword = watch("oldPassword");

  const onSubmit: SubmitHandler<MyPasswordForm> = (data) => {
    const postData = async () => {
      const [responseData, message, isSuccess] = await sendRequest(
        "put",
        "auth/change-password",
        data,
        true
      );

      if (isSuccess) {
        router.push(`/akun/me`);
      }
    };
    postData();
  };

  return (
    <main>
      <section className="mb-5">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="oldPassword"
                validation={{ required: "Password wajib diisi" }}
                placeholder="*******"
                label="Password Lama"
                type="password"
              />
              <Input
                id="newPassword"
                validation={{
                  required: "Password Baru wajib diisi",
                  validate: (value) =>
                    value !== oldPassword ||
                    "Password baru tidak boleh sama dengan password lama",
                }}
                placeholder="*******"
                label="Password Baru"
                type="password"
              />
            </div>
            <div className="mt-5 flex items-center justify-center gap-4">
              <Button type="submit">Submit</Button>
              <Link href={`/akun/me`}>
                <Button variant="danger">Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(ChangePasswordPage, "user");
