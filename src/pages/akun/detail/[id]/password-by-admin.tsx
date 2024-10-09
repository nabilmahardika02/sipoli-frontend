
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PasswordByAdminForm } from "@/types/forms/authForm";
import sendRequest from "@/lib/getApi";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import Link from "next/link";

const ChangePasswordByAdminPage = () => {
    const { setTitle } = useDocumentTitle();

    useEffect(() => {
        setTitle("Ubah Password");
    }, [setTitle]);

    const router = useRouter();
    const methods = useForm<PasswordByAdminForm>({
        mode: "onTouched",
    });

    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<PasswordByAdminForm> = (data) => {
        const postData = async () => {
          const [responseData, message, isSuccess] = await sendRequest(
            "put",
            "auth/change-password-by-admin",
            {...data, accountId:router.query.id},
            true
          );
    
          if (isSuccess) {
            router.push(`/akun/detail/${router.query.id}`);
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
                    id="newPassword"
                    validation={{ required: "Password wajib diisi" }}
                    placeholder="*******"
                    label="Password Baru"
                    type="password"
                  />
                </div>
                <div className="mt-5 flex items-center justify-center gap-4">
                  <Button type="submit">
                    Submit
                  </Button>
                  <Link href={`/akun/detail/${router.query.id}`}>
                    <Button variant="danger">
                      Cancel
                      </Button>
                  </Link>
                </div>
              </form>
            </FormProvider>
          </section>
        </main>
    )
}

export default withAuth(ChangePasswordByAdminPage, "OPERATOR");