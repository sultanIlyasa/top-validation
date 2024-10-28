import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import NewPassForm from "@/components/auth/NewPassForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const newPassword = () => {
  return (
    <div className="mx-auto min-h-screen flex flex-col items-center md:flex-row-reverse">
      <section className="mt-44 md:mt-0 flex flex-col items-center justify-center pr-10 mr-10">
        <h1 className="text-[#00491E] text-center font-bold text-xl md:text-3xl">
          Choose your new password.
        </h1>
        <ul className="list-disc text-sm md:text-lg mx-10 md:mx-0 lg:mx-32 mt-4">
          <li>Your previous can’t be the new password.</li>
          <li>Your password must be 8 characters.</li>
          <li>
            Your password should contain upper case letters, lower case letter
            and numbers.
          </li>
        </ul>
      </section>
      <Card className=" my-10 w-[80%] md:w-[50%] lg:w-[50%] md:ml-20 md:mr-10  lg:ml-40 lg:mr-20 xl:w-[30%] h-full border-[#006558] border-2 rounded-3xl items-center">
        <CardHeader>
          <CardTitle className="font-bold text-center text-[#00491E]">
            New Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewPassForm />
        </CardContent>
        <div className="flex flex-col items-center">
          <Button className="py-[18px] px-[100px] my-4 shadow-lg shadow-[#36FFBF4D] bg-[#00CA87] ">
            Submit
          </Button>
        </div>
        <div className="flex flex-row items-center justify-center mt-4">
          <Link href={"#"} className="text-xs text-gray-500">
            Terms of user
          </Link>
          <p className="text-xs mx-2"> | </p>
          <Link href={"#"} className="text-xs text-gray-500">
            Privacy policy
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
};

export default newPassword;
