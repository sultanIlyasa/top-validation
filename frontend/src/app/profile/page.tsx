'use client'
import React from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Backend_URL } from "@/lib/Constants";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const ProfilePage = async (props: Props) => {
  const router = useRouter();
  const session = await getSession();
  if (!session) {
    return "No active session found";
  }
  const response = await fetch(Backend_URL + `/users/${session.user.id}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + session.backendTokens.access_token,
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error loading user data:", response.statusText);
    return <p>Error loading user data</p>;
  }
  const user = await response.json();
  if (user.company === null) {
    router.push("/profile/edit");
  }
  console.log("User data:", user);
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
};

export default ProfilePage;
