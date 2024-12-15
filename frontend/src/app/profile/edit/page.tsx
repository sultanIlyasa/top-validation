"use client";
import React from "react";
import Image from "next/image";
import CompanyProfileForm from "@/components/company/CompanyProfileForm";
import AnalystProfileForm from "@/components/analyst/AnalystProfileForm";
import ProfilePictureForm from "@/components/users/ProfilePictureForm";
import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { Backend_URL } from "@/lib/Constants";
import { z } from "zod";
import { useRouter } from "next/navigation";

const updateFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z
    .object({
      companyName: z.string().optional(),
      positions: z.string().optional(),
      address: z
        .object({
          companyAddress: z.string().optional(),
          province: z.string().optional(),
          district: z.string().optional(),
          city: z.string().optional(),
          region: z.string().optional(),
          postcode: z.string().optional(),
          country: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  analyst: z
    .object({
      nikEmployee: z.string().optional(),
      position: z.string().optional(),
      superior: z.string().optional(),
    })
    .optional(),
});
const EditPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Router = useRouter();
  const handleSubmit = async (
    values: z.infer<typeof updateFormSchema>
  ): Promise<void> => {
    const filteredValues = JSON.parse(
      JSON.stringify(values, (key, value) => (value ? value : undefined))
    );
    setIsSubmitting(true);

    try {
      const session = await getSession();
      if (!session) {
        throw new Error("User not logged in");
      }

      const result = await fetch(
        Backend_URL + `/profile/update/${session.user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + session.backendTokens.access_token,
            "Content-type": "application/json",
          },
          body: JSON.stringify(filteredValues),
        }
      );

      if (!result.ok) {
        throw new Error(`Error: ${result.statusText}`);
      }

      const data = await result.json();
      console.log("User data updated:", data);
      setIsSubmitting(false);
      Router.replace("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSubmitting(false);
    }
  };
  const { data: session, status } = useSession();
  if (!session) {
    return "No active session found";
  }
  console.log("Session:", session.user.role);

  if (session.user.role === "COMPANY") {
    return (
      <div className="">
        <div className="mb-16 mx-5 px-5 lg:mx-20 lg:px-20 md:mx-10 md:px-10 ">
          <div className="flex flex-col mt-6">
            <h1 className="text-xl font-bold text-center md:text-left">
              Profile Section
            </h1>
            <p className="hidden text-xs text-justify text-gray-400 mb-5 md:block">
              Your profile is almost complete! Just a few more details to go...
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
                  <ProfilePictureForm />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <button
                  type="submit"
                  form="company-profile-form"
                  disabled={isSubmitting}
                  className="bg-[#DC6803] text-sm my-2 px-2 py-1 text-white sm:px-4 sm:py-2 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
            <div className="flex flex-col ">
              <CompanyProfileForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (session.user.role === "ANALYST") {
    return (
      <div className="">
        <div className="mb-16 mx-5 px-5 lg:mx-20 lg:px-20 md:mx-10 md:px-10 ">
          <div className="flex flex-col mt-6">
            <h1 className="text-xl font-bold text-center md:text-left">
              Profile Section
            </h1>
            <p className="hidden text-xs text-justify text-gray-400 mb-5 md:block">
              Your profile is almost complete! Just a few more details to go...
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
                  <ProfilePictureForm />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <button
                  type="submit"
                  form="company-profile-form"
                  disabled={isSubmitting}
                  className="bg-[#DC6803] text-sm my-2 px-2 py-1 text-white sm:px-4 sm:py-2 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
            <div className="flex flex-col ">
              <AnalystProfileForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default EditPage;
