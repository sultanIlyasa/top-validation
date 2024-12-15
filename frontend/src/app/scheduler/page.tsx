import { z } from "zod";
import { Backend_URL } from "@/lib/Constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import React from "react";
import SchedulerPageClient from "./SchedulerPageClient";


//  Don't forget to add documentation to the code
const SchedulerPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>You need to be logged in to view this page</p>;
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

  return <SchedulerPageClient user={user} />;
};

export default SchedulerPage;
