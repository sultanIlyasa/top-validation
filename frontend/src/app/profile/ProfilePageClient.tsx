"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Company = {
  profpicUrl: string;
  firstName: string;
  lastName: string;
  company: {
    companyName: string;
    positions: string;
    address: {
      companyAddress: string;
      province: string;
      district: string;
      city: string;
      region: string;
      postcode: string;
      country: string;
      latitude: number;
      longitude: number;
    };
  };
};

type Analyst = {
  profpicUrl: string;
  firstName: string;
  lastName: string;
  analyst: {
    nikEmployee: string;
    position: string;
    superior: string;
  };
};

type Props = {
  user: Company | Analyst;
};

const ProfilePageClient = ({ user }: Props) => {
  const router = useRouter();
  const isProfileEmpty =
    "company" in user &&
    user.company === null &&
    "analyst" in user &&
    user.analyst === null;
  if (isProfileEmpty) {
    router.push("/profile/edit");
  }
  const isCompanyProfile = "company" in user && user.company !== null;
  if (isCompanyProfile) {
    return (
      <div className="mb-16 mx-5 px-5 lg:mx-20 lg:px-20 md:mx-10 md:px-10 ">
        <div className="flex flex-col mt-6">
          <h1 className="text-xl font-bold text-center md:text-left">
            Profile Section
          </h1>
          <p className="hidden text-xs text-justify text-gray-400 mb-5 md:block">
            Thank you for completing your profile. Remember to update your
            profile regularly✨
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-between">
            <div className="flex flex-col justify-center items-center md:flex-row ">
              <Image
                src={user.profpicUrl}
                width={100}
                height={100}
                alt={`${user.firstName}'s profile`}
                className="rounded-full w-16 h-16"
              />
              <div className="flex flex-col items-center md:items-start md:mx-6">
                <h2 className="text-xl font-bold mt-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 text-xs">
                  {user.company.companyName}
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
                <p className="my-1">{user.firstName}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs mb-1">Last Name</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mb-1">
                <p className="my-1">{user.lastName}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Company Name</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.company.companyName}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Country</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.company.address.country}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Province</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.company.address.province}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">City</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.company.address.city}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">District</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.company.address.district}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Postal Code</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.company.address.postcode}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Company Address</p>
              <div className="flex h-full w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                {user.company.address.companyAddress}
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Position </p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.company.positions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if ("analyst" in user) {
    return (
      <div className="mb-16 mx-5 px-5 lg:mx-20 lg:px-20 md:mx-10 md:px-10 ">
        <div className="flex flex-col mt-6">
          <h1 className="text-xl font-bold text-center md:text-left">
            Profile Section
          </h1>
          <p className="hidden text-xs text-justify text-gray-400 mb-5 md:block">
            Thank you for completing your profile. Remember to update your
            profile regularly✨
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-between">
            <div className="flex flex-col justify-center items-center md:flex-row ">
              <Image
                src={user.profpicUrl}
                width={100}
                height={100}
                alt={`${user.firstName}'s profile`}
                className="rounded-full w-16 h-16"
              />
              <div className="flex flex-col items-center md:items-start md:mx-6">
                <h2 className="text-xl font-bold mt-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 text-xs">
                  {user.analyst.nikEmployee}
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
                <p className="my-1">{user.firstName}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs mb-1">Last Name</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mb-1">
                <p className="my-1">{user.lastName}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Employee Number</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.analyst.nikEmployee}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Position</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.analyst.position}</p>
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-xs my-1">Superior</p>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ">
                <p className="my-1">{user.analyst.superior}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ProfilePageClient;
