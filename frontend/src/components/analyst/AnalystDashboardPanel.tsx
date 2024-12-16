"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Session } from "next-auth"; // Import the Session type for type safety
import { Backend_URL } from "@/lib/Constants";
import { Card, CardContent, CardTitle, CardDescription } from "../ui/card";
import Link from "next/link";

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
const date = new Date().toLocaleDateString(undefined, options);

interface AnalystDashboardPanelProps {
  sessionData: Session | null;
}

interface ScheduleProps {
  companyId: string;
  analystId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  company?: {
    firstName: string;
    lastName: string;
    company: {
      companyName: string;
      positions: string;
      id: string;
      userId: string;
    };
  };
  analyst?: {
    nikEmployee: string;
    position: string;
    superior: string;
  };
  videoCall?: {
    id: string;
    roomId: string;
  };
}

// Utility function for advanced date formatting
function formatScheduleDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Invalid date formatting:", error);
    return dateString; // Fallback to original string if formatting fails
  }
}

function nextMeetingTime(date: string, startTime: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  try {
    const time = new Date(`${date}T${startTime}`);
    return time.toLocaleTimeString(undefined, options);
  } catch (error) {
    console.error("Invalid time formatting:", error);
    return startTime; // Fallback to original string if formatting fails
  }
}

// Utility function for time formatting with AM/PM
function formatScheduleTime(timeString: string): string {
  try {
    const time = new Date(timeString);
    return time.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Invalid time formatting:", error);
    return timeString; // Fallback to original string if formatting fails
  }
}

const AnalystDashboardPanel: React.FC<AnalystDashboardPanelProps> = ({
  sessionData,
}) => {
  const [schedules, setSchedules] = useState<ScheduleProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [nextMeeting, setNextMeeting] = useState<{
    date: string;
    startTime: string;
  } | null>(null);

  const fetchClosestSchedules = React.useCallback(async () => {
    if (!sessionData) {
      return;
    }
    try {
      const response = await fetch(
        `${Backend_URL}/schedule/closest/${sessionData.user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionData.backendTokens.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setNextMeeting(data);
    } catch (error) {
      console.error("Error fetching closest schedule:", error);
    }
  }, [sessionData]); // Remove recursive call
  const fetchSchedules = React.useCallback(async () => {
    // Only fetch if we have session data
    if (!sessionData) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${Backend_URL}/schedule/all/${sessionData.user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionData.backendTokens.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const data: ScheduleProps[] = await response.json();
      setSchedules(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Schedule fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionData]);

  // Fetch schedules when component mounts or sessionData changes
  // In your existing useEffect
  useEffect(() => {
    fetchSchedules();
    fetchClosestSchedules(); // Add this line
  }, [fetchSchedules, fetchClosestSchedules]);
  useEffect(() => {
    if (nextMeeting && nextMeeting.startTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const meetingTime = new Date(nextMeeting.startTime);
        const diff = meetingTime.getTime() - now.getTime();

        // Debug logging
        console.log("Current Time:", now);
        console.log("Meeting Time:", meetingTime);
        console.log("Time Difference (ms):", diff);

        if (isNaN(diff)) {
          console.error("Invalid meeting time calculation", nextMeeting);
          setTimeRemaining("No upcoming meetings");
          return;
        }

        if (diff <= 0) {
          setTimeRemaining("Meeting is happening now!");
        } else {
          // Calculate days, hours, and minutes
          const totalMinutes = Math.floor(diff / (1000 * 60));
          const days = Math.floor(totalMinutes / (60 * 24));
          const remainingMinutesAfterDays = totalMinutes % (60 * 24);
          const hours = Math.floor(remainingMinutesAfterDays / 60);
          const minutes = remainingMinutesAfterDays % 60;

          // Construct time remaining string
          let timeRemainingText = "";

          if (days > 0) {
            timeRemainingText += `${days} day${days > 1 ? "s" : ""} `;
          }

          if (hours > 0 || days > 0) {
            timeRemainingText += `${hours} hours `;
          }

          // Only show minutes if we haven't already shown days and hours
          if (days === 0 && hours === 0) {
            timeRemainingText += `${minutes} min`;
          }

          setTimeRemaining(timeRemainingText.trim());
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining("No upcoming meetings");
    }
  }, [nextMeeting]);
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading schedules...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Error: {error}</p>
        <button
          onClick={fetchSchedules}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry Fetch
        </button>
      </div>
    );
  }
  const ScheduleCard = ({ schedules }: { schedules: ScheduleProps[] }) => {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return <p>No schedules found</p>;
    }
    return (
      // map over schedules and return a card for each schedule
      schedules.map((schedule: ScheduleProps) => (
        <Card
          key={schedule.companyId}
          className="flex flex-col mx-auto  w-[90%]   border shadow-xl rounded-xl  "
        >
          <CardTitle className="text-xs mx-3 mt-4 mb-2">
            {schedule.company?.company.companyName}
          </CardTitle>
          <CardContent className="p-0 mx-3">
            <CardDescription>
              {schedule.videoCall?.roomId === undefined ? (
                <p className="text-[10px] mb-3">
                  Meeting ID: No Video Call Scheduled
                </p>
              ) : (
                <p className="text-[10px]">
                  Meeting ID: {schedule.videoCall?.roomId}
                </p>
              )}
              <div className="flex flex-row">
                <Image
                  src={"/dashboard/featured_icon.png"}
                  alt="featured icon"
                  width={0}
                  height={0}
                  sizes="100vm"
                  className="w-10 h-10 sm:w-[20%] md:w-[15%] lg:w-[10%]  sm:h-auto my-auto"
                ></Image>
                <div className="flex flex-col  my-3 mx-2">
                  <p className="text-xs font-bold">
                    {formatScheduleDate(schedule.date)}
                  </p>
                  <p className="text-[9px]">
                    {formatScheduleTime(schedule.startTime)} -{" "}
                    {formatScheduleTime(schedule.endTime)}
                  </p>
                </div>
              </div>

              {schedule.status === "PENDING" ? (
                <Link href={"/scheduler"}>
                  <p className="text-xs flex flex-col items-center justify-center bg-orange-500 rounded-md text-white py-2 mt-2 mb-4">
                    Not Confirmed
                  </p>
                </Link>
              ) : schedule.status === "CONFIRMED" ? (
                <Link href={"/meeting"}>
                  <p className="text-xs flex flex-col items-center justify-center bg-green-500 rounded-md text-white py-2 mt-2 mb-4">
                    Confirmed
                  </p>
                </Link>
              ) : schedule.status === "REJECTED" ? (
                <Link href={"/scheduler"}>
                  <p className="text-xs flex flex-col items-center justify-center bg-red-500 rounded-md text-white py-2 mt-2 mb-4">
                    Rejected
                  </p>
                </Link>
              ) : schedule.status === "RESCHEDULED" ? (
                <Link href={"/scheduler"}>
                  <p className="text-xs flex flex-col items-center justify-center bg-yellow-500 rounded-md text-white py-2 mt-2 mb-4">
                    Rescheduled
                  </p>
                </Link>
              ) : schedule.status === "COMPLETED" ? (
                <Link href={"/meeting"}>
                  <p className="text-xs flex flex-col items-center justify-center bg-blue-500 rounded-md text-white py-2 mt-2 mb-4">
                    Completed
                  </p>
                </Link>
              ) : (
                <p className="text-xs flex flex-col items-center justify-center bg-gray-500 rounded-md text-white py-2 mt-2 mb-4">
                  Unknown Status
                </p>
              )}
            </CardDescription>
          </CardContent>
        </Card>
      ))
    );
  };

  return (
    <div className="">
      <div className="flex mx-auto sm:w-[70%]  lg:w-[50%] xl:w-[40%] h-full border border-green-700 my-4 rounded-xl px-1">
        <div className="grid grid-cols-3 w-full py-1  ">
          <div className="flex flex-row border-r items-center justify-center">
            <Image
              src="/dashboard/videocall_icon.png"
              alt="Video call icon"
              width={0}
              height={0}
              sizes="100vw"
              className="w-10 h-10  sm:w-[25%] md:w-[20%] lg:w-[15%]  sm:h-auto my-auto"
            ></Image>
            <div className="flex flex-col mx-2">
              <p className="text-left text-[10px] sm:text-base md:text-sm font-extralight">
                Meeting starts in
              </p>
              <p className="text-[8px] sm:text-sm md:text-xs ">
                {timeRemaining}
              </p>
            </div>
          </div>
          <div className="flex flex-row border-r items-center justify-center">
            <Image
              src="/dashboard/schedule_icon.png"
              alt="schedule icon"
              width={0}
              height={0}
              sizes="100vw"
              className="w-10 h-10  sm:w-[25%] md:w-[20%] lg:w-[15%]  sm:h-auto my-auto"
            ></Image>
            <div className="flex flex-col mx-2 ">
              <p className=" text-left text-[10px] sm:text-base md:text-sm font-extralight">
                Date and Time
              </p>
              <p className="text-[6px] sm:text-sm md:text-xs ">{date}</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center">
            <Image
              src="/dashboard/total_merchant.png"
              alt="schedule icon"
              width={0}
              height={0}
              sizes="100vw"
              className="w-10 h-10  sm:w-[25%] md:w-[20%] lg:w-[15%]  sm:h-auto my-auto"
            ></Image>
            <div className="flex flex-col mx-2 ">
              <p className=" text-left text-[7px] sm:text-base md:text-sm font-extralight">
                Total Merchant
              </p>
              <p className="text-[7px] sm:text-sm md:text-xs ">15 Company</p>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <h1 className=" text-lg font-bold border-b my-3 py-2">
          Upcoming Schedules
        </h1>
        <div className="grid grid-cols-2 justify-center items-center md:grid-cols-3 sm:gap-4 ">
          <ScheduleCard schedules={schedules} />
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboardPanel;
