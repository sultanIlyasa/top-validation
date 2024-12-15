import React from "react";
import { Backend_URL } from "@/lib/Constants";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import ProfilePageClient from "./ProfilePageClient";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
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
  console.log(user);
  return <ProfilePageClient user={user} />;
};

export default ProfilePage;
