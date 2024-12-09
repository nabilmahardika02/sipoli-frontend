import Button from "@/components/elements/Button";
import Input from "@/components/elements/forms/Input";
import withAuth from "@/components/hoc/withAuth";
import { useDocumentTitle } from "@/context/Title";
import sendRequest from "@/lib/getApi";
import { PasswordByAdminForm } from "@/types/forms/authForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm, RegisterOptions } from "react-hook-form";

const passwordValidation: RegisterOptions = {
  required: "Password wajib diisi",
  minLength: { value: 8, message: "Minimal 8 karakter" },
  maxLength: { value: 30, message: "Minimal 30 karakter" },
  validate: {
    // Validasi setidaknya 1 huruf kecil
    hasLowercase: (value) => 
      /(?=.*[a-z])/.test(value) || "Harus mengandung minimal 1 huruf kecil",
    
    // Validasi setidaknya 1 huruf besar
    hasUppercase: (value) => 
      /(?=.*[A-Z])/.test(value) || "Harus mengandung minimal 1 huruf besar",
    
    // Validasi setidaknya 1 angka
    hasNumber: (value) => 
      /(?=.*\d)/.test(value) || "Harus mengandung minimal 1 angka",
    
    // Validasi setidaknya 1 simbol
    hasSymbol: (value) => 
      /(?=.*[!@#$%^&*])/.test(value) || "Harus mengandung minimal 1 simbol (!@#$%^&*)",
    
    // Validasi tanpa spasi
    noSpaces: (value) => 
      !/\s/.test(value) || "Tidak boleh mengandung spasi",

    noCertainSymbol: (value) => 
      !/<>/.test(value) || "Gunakan simbol (!@#$%^&*) saja"
  }
}

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
        { ...data, accountId: router.query.id },
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
                validation={passwordValidation}
                placeholder="*******"
                label="Password Baru"
                type="password"
              />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button type="submit">Submit</Button>
              <Link href={`/akun/detail/${router.query.id}`}>
                <Button variant="danger">Cancel</Button>
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
};

export default withAuth(ChangePasswordByAdminPage, "OPERATOR");
