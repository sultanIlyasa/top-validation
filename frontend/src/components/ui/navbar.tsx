"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Backend_URL } from "@/lib/Constants";
import { getSession } from "next-auth/react";
import { cookies } from "next/headers";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const session = await getSession();
    if (!session) {
      console.error("No active session found");
      return;
    }

    const response = await fetch(Backend_URL + `/users/${session.user.id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session.backendTokens.access_token,
        "Content-type": "application/json",
      },
    });

    const user = await response.json();
    // Then use NextAuth's signOut to clear frontend session

    const logoutResponse = await fetch(
      Backend_URL + `/auth/logout/${session.user.id}`,
      {
        method: "POST",
        credentials: "include", // Use cookies for session-based authentication, if applicable
      }
    );
    await signOut({
      redirect: false,
      callbackUrl: "/auth/login",
    });
    if (logoutResponse.ok) {
      router.push("/auth/login"); // Redirect to login page on logout
    } else {
      console.error("Logout failed:", logoutResponse.statusText);
    }
  };

  return (
    <>
      {/* Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 z-50 border-[#00491E] sm:relative sm:border-t-8 sm:hidden">
        <div className="w-full">
          <div className="flex justify-between items-center p-2">
            <div className="flex flex-row items-center mx-auto text-xs">
              <Link href="/" className="flex flex-col items-center p-1">
                <Image
                  src={"/navbar/logo_home.png"}
                  height={200}
                  width={200}
                  alt="logo"
                />
                Home
              </Link>
              <Link
                href="/scheduler"
                className="flex flex-col items-center p-1"
              >
                <Image
                  src={"/navbar/logo_scheduler.png"}
                  height={80}
                  width={80}
                  alt="logo"
                />
                Scheduler
              </Link>
              <Link href="/" className="flex flex-col items-center p-1">
                <Image
                  src={"/navbar/logo_bixbox_md.png"}
                  height={200}
                  width={200}
                  alt="logo"
                />
              </Link>
              <Link href="/meeting" className="flex flex-col items-center p-1">
                <Image
                  src={"/navbar/logo_videocall.png"}
                  height={200}
                  width={200}
                  alt="logo"
                />
                Meeting
              </Link>
              <Link href="/profile" className="flex flex-col items-center p-1">
                <Image
                  src="/bixbox-logo.png"
                  alt="profile"
                  width={16}
                  height={16}
                  className="rounded-full w-6 h-6"
                />
                Profile
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center p-1 text-xs text-red-500"
              >
                <Image
                  src="/navbar/logout_icon.png"
                  alt="logout"
                  width={20}
                  height={20}
                />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden bg-white border-b-2 py-3 z-50 sm:block">
        <div className="w-full">
          <div className="flex justify-between items-center lg:px-20 mx-20">
            <Link href="/" className="flex flex-col items-center p-1">
              <Image
                src={"/bixbox-logo.png"}
                height={80}
                width={80}
                alt="logo"
              />
            </Link>
            <div className="flex flex-row">
              <Link
                href="/"
                className="flex flex-col gap-2 items-center p-1 text-xs"
              >
                <Image
                  src={"/navbar/logo_home.png"}
                  height={50}
                  width={80}
                  alt="logo"
                />
                Home
              </Link>
              <Link
                href="/scheduler"
                className="flex flex-col gap-2 items-center p-1 text-xs"
              >
                <Image
                  src={"/navbar/logo_scheduler.png"}
                  height={80}
                  width={80}
                  alt="logo"
                />
                Scheduler
              </Link>
              <Link
                href="/meeting"
                className="flex flex-col gap-2 items-center p-1 text-xs"
              >
                <Image
                  src={"/navbar/logo_videocall.png"}
                  height={200}
                  width={80}
                  alt="logo"
                />
                Meeting
              </Link>
              <Link
                href="/profile"
                className="flex flex-col gap-2 items-center p-1 text-xs"
              >
                <Image
                  src="/bixbox-logo.png"
                  alt="profile"
                  width={100}
                  height={100}
                  className="rounded-full w-6 h-6"
                />
                Profile
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex flex-col gap-2 items-center p-1 text-xs text-red-500"
              >
                <Image
                  src="/navbar/logout_icon.png"
                  alt="logout"
                  width={20}
                  height={20}
                />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
