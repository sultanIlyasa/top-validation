"use client";
import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import LoginForm from "@/components/auth/loginForm";
import Link from "next/link";

const loginpage = () => {
  return (
    <div className="mx-auto min-h-screen flex flex-col items-center md:flex-row md:justify-center md:gap-28">
      <section className="mt-44 flex flex-col items-center md:mt-0">
        {" "}
        <Image
          src={"/bixbox-logo.png"}
          alt="Bixbox Logo"
          width={165}
          height={81}
          className="md:w-[330px] md:h-[162px]"
        ></Image>
        <h1 className="font-bold text-xl md:text-3xl md:font-extrabold text-[#00491E] mt-3">
          Meeting Platform
        </h1>
        <h2 className="text-sm md:text-lg lg:text-2xl">
          Welcome to Bixbox video call meeting !
        </h2>
      </section>
      <Card className="my-10 w-[80%] md:w-[35%] lg:w-[30%] lg:max-w-[610px] h-full border-[#006558] rounded-3xl border-2">
        <CardContent className="mt-6 pb-0">
          <LoginForm />
        </CardContent>
        <div className="flex flex-row items-center justify-center mt-4">
          <Link href={"#"} className="text-xs text-gray-500">
            Terms of user
          </Link>
          <p className="text-xs mx-2"> | </p>
          <Link href={"#"} className="text-xs text-gray-500">
            Privacy policy
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center mt-4 mb-7 lg:mb-20 text-gray-500 font-semibold text-xs">
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

export default loginpage;
