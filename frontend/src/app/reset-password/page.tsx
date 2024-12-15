"use client";
import { useRouter, useSearchParams } from "next/navigation";
import NewPassForm from "@/components/auth/NewPassForm";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="mx-auto min-h-screen flex flex-col items-center md:flex-row-reverse">
      <section className="mt-44 md:mt-0 flex flex-col items-center justify-center pr-10 mr-10">
        <h1 className="text-[#00491E] text-center font-bold text-xl md:text-3xl">
          Choose your new password.
        </h1>
        <ul className="list-disc text-sm md:text-lg mx-10 md:mx-0 lg:mx-32 mt-4">
          <li>Your previous password can't be the new password.</li>
          <li>Your password must be at least 8 characters.</li>
          <li>Your password should contain upper, lower case letters and numbers.</li>
        </ul>
      </section>
      <Card className="my-10 w-[80%] md:w-[50%] lg:w-[50%] md:ml-20 md:mr-10 lg:ml-40 lg:mr-20 xl:w-[30%] h-full border-[#006558] border-2 rounded-3xl items-center">
        <CardHeader>
          <CardTitle className="font-bold text-center text-[#00491E]">
            New Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewPassForm token={token} />
        </CardContent>
        <div className="flex flex-row items-center justify-center mt-4">
          <Link href={"#"} className="text-xs text-gray-500">
            Terms of Use
          </Link>
          <p className="text-xs mx-2"> | </p>
          <Link href={"#"} className="text-xs text-gray-500">
            Privacy Policy
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center mt-4 mb-7 text-gray-500 font-semibold text-xs">
          <Link href={"#"} className="pl-4">
            +62 881 1688 355
          </Link>
          <p className="text-sm"> | </p>
          <Link href={"#"} className="">
            Chat dengan CS Bixbox
          </Link>
        </div>
      </Card>
    </div>
  );
}
