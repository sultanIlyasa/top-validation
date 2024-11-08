import React from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const ProfilePage = () => {
  return (
    <div className="mb-16 mx-5 px-5 lg:mx-20 lg:px-20 md:mx-10 md:px-10 ">
      <div className="flex flex-col mt-6">
        <h1 className="text-xl font-bold text-center md:text-left">
          Profile Section
        </h1>
        <p className="hidden text-xs text-justify text-gray-400 mb-5 md:block">
          Thank you for completing your profile. Remember to update your profile
          regularly✨
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-between">
          <div className="flex flex-col justify-center items-center md:flex-row ">
            <Image
              src="/bixbox-logo.png"
              width={100}
              height={100}
              alt="profile"
              className="rounded-full w-16 h-16"
            />
            <div className="flex flex-col items-center md:items-start md:mx-6">
              <h2 className="text-xl font-bold mt-2">John Doe</h2>
              <p className="text-gray-500 text-xs">
                PT Pabrik Kertas Tjiwi Kimia
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link href={"/profile/edit"}>
              <button className="bg-[#DC6803] text-sm my-2 px-2 py-1 text-white sm:px-4 sm:py-2 rounded-md">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col my-8 md:grid md:grid-cols-2 md:gap-3">
          <div className="">
            <p className="text-gray-500 text-xs mb-1">First Name</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mb-1">
              <p className="my-1">Ando</p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs mb-1">Last Name</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mb-1">
              <p className="my-1">Santos</p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">Company Name</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              <p className="my-1">PT Pabrik Kertas Tjiwi Kimia</p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">Country</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              <p className="my-1">Indonesia</p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">Province</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              <p className="my-1">DKI Jakarta</p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">City</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              <p className="my-1">Kota Jakarta Pusat</p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">District</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              <p className="my-1">Menteng</p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">Postal Code</p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              <p className="my-1">10350 </p>
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">Company Address</p>
            <div className="flex h-full w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              Jl. M.H. Thamrin, RT.9/RW.4, Gondangdia, Kec. Menteng, Kota
              Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10350
            </div>
          </div>
          <div className="">
            <p className="text-gray-500 text-xs my-1">Position </p>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
              <p className="my-1">Director of Finance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
