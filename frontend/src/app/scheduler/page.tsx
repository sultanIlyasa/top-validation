"use client";
import { z } from "zod";
import { Backend_URL } from "@/lib/Constants";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";
import CompanyScheduleForm from "@/components/company/CompanyScheduleForm";
import AnalystScheduleForm from "@/components/analyst/AnalystScheduleForm";

const FormSchema = z.object({
  date: z.date({
    message: "Please select a date",
  }),
  time: z.string({
    message: "Please select a time",
  }),
});

//  Don't forget to add documentation to the code
const schedulerPage = async () => {
  const { data: session } = useSession();
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

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

  // Generate time slots based on the selected date
  const generateTimeSlots = (baseDate: Date, timeString: string) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(".").map((num) => parseInt(num));
    //  Set the start date to the selected date
    const startDate = new Date(baseDate);
    // Set the hours and minutes
    startDate.setHours(hours, minutes || 0, 0, 0);

    // Set the end date to the start date
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };
  };

  const handleSubmitCompany = async (values: z.infer<typeof FormSchema>) => {
    try {
      setIsSubmitting(true);
      const session = await getSession();
      if (!session) {
        throw new Error("User not logged in");
      }

      const timeSlots = generateTimeSlots(values.date, values.time);
      const requestBody = {
        companyId: session.user.id,
        date: values.date.toISOString(),
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
      };

      const result = await fetch(
        Backend_URL + `/schedule/create/${session.user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.backendTokens.access_token,
            "Content-type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!result.ok) {
        throw new Error("Failed to create schedule");
      }

      const data = await result.json();
      setIsSubmitting(false);
      router.replace("/");
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating schedule:", error);
    }
  };

  if (user.role === "COMPANY") {
    return (
      <div className="mx-5 min-h-screen mt-10">
        <h1 className="font-bold text-left">
          Schedule Virtual Meetings Online
        </h1>
        <p className="text-xs text-left">
          Check out our availability and book the date and time that works for
          you
        </p>

        <div className="">
          <div>
            <CompanyScheduleForm onSubmit={handleSubmitCompany} />
          </div>
        </div>
      </div>
    );
  } else if (user.role === "ANALYST") {
    return (
      <div className="mx-5 min-h-screen mt-10">
        <h1 className="font-bold text-left">
          Schedule Virtual Meetings Online
        </h1>

        <div className="">
          <div>
            <AnalystScheduleForm />
          </div>
        </div>
      </div>
    );
  }
};

export default schedulerPage;
