"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <>
      {/* // Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#00491E] sm:relative sm:border-t-8 sm:hidden">
        <div className="w-full">
          <div className="flex justify-between items-center p-2">
            <div className="flex flex-row items-center mx-auto text-xs">
              <Link href="/" className="flex flex-col items-center p-1">
                <Image
                  src={"/navbar/logo_home.png"}
                  height={200}
                  width={200}
                  alt="logo"
                  className="w-[]"
                ></Image>
                Home
              </Link>
              <Link href="/" className="flex flex-col items-center p-1">
                <Image
                  src={"/navbar/logo_scheduler.png"}
                  height={80}
                  width={80}
                  alt="logo"
                ></Image>
                Scheduler
              </Link>
              <Link href="/" className="flex flex-col items-center p-1">
                <Image
                  src={"/navbar/logo_bixbox_md.png"}
                  height={200}
                  width={200}
                  alt="logo"
                ></Image>
              </Link>
              <Link href="/" className="flex flex-col items-center p-1">
                <Image
                  src={"/navbar/logo_videocall.png"}
                  height={200}
                  width={200}
                  alt="logo"
                ></Image>
                Meeting
              </Link>
              <Link href="/" className="flex flex-col items-center p-1">
                <Image
                  src="/bixbox-logo.png"
                  alt="profile"
                  width={16}
                  height={16}
                  className="rounded-full w-6 h-6"
                />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Dekstop */}
      <div className="hidden bg-white border-b-2 py-3 sm:block">
        <div className="w-full">
          <div className="flex justify-between items-center lg:px-20 mx-20 ">
            <Link href="/" className="flex flex-col items-center p-1">
              <Image
                src={"/bixbox-logo.png"}
                height={80}
                width={80}
                alt="logo"
              ></Image>
            </Link>
            <div className="flex flex-row ">
              <Link href="/" className="flex flex-col gap-2 items-center p-1 text-xs">
                <Image
                  src={"/navbar/logo_home.png"}
                  height={50}
                  width={80}
                  alt="logo"
                  className=""
                ></Image>
                Home
              </Link>
              <Link href="/" className="flex flex-col gap-2 items-center p-1 text-xs">
                <Image
                  src={"/navbar/logo_scheduler.png"}
                  height={80}
                  width={80}
                  alt="logo"
                ></Image>
                Scheduler
              </Link>
              <Link href="/" className="flex flex-col gap-2 items-center p-1 text-xs">
                <Image
                  src={"/navbar/logo_videocall.png"}
                  height={200}
                  width={80}
                  alt="logo"
                ></Image>
                Meeting
              </Link>
              <Link href="/" className="flex flex-col gap-2 items-center p-1 text-xs">
                <Image
                  src="/bixbox-logo.png"
                  alt="profile"
                  width={100}
                  height={100}
                  className="rounded-full w-6 h-6"
                />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
