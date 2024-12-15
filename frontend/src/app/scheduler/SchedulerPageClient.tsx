"use client";
import React from "react";
import AnalystScheduleForm from "@/components/analyst/AnalystScheduleForm";
import CompanyScheduleForm from "@/components/company/CompanyScheduleForm";
import { z } from "zod";
import { Backend_URL } from "@/lib/Constants";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  date: z.date({
    message: "Please select a date",
  }),
  time: z.string({
    message: "Please select a time",
  }),
});

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
const SchedulerPageClient = ({ user }: Props) => {
  const router = useRouter();
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

      alert("Schedule created successfully");
      router.replace("/");
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };
  const isCompanyProfile = "company" in user && user.company !== null;

  if (isCompanyProfile) {
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
  }
  if ("analyst" in user) {
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

export default SchedulerPageClient;
