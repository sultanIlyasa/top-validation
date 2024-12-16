"use client";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { getSession, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Backend_URL } from "@/lib/Constants";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  date: z.date({
    message: "Please select a date",
  }),
  time: z.string({
    message: "Please select a time",
  }),
});

interface CompanyScheduleFormProps {
  onSubmit: (values: z.infer<typeof FormSchema>) => Promise<void>;
}

const CompanyScheduleForm = ({ onSubmit }: CompanyScheduleFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [companyName, setCompanyName] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    const fetchCompanyName = () => {
      getSession().then((session) => {
        if (!session) {
          setIsLoading(false);
          return;
        }

        return fetch(`${Backend_URL}/users/${session.user.id}`, {
          headers: {
            Authorization: `Bearer ${session.backendTokens.access_token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch user data");
            }
            return response.json();
          })
          .then((user) => {
            setCompanyName(user.company.companyName);
          })
          .catch((error) => {
            console.error("Error fetching company name:", error);
            toast({
              title: "Error",
              description: "Failed to load company information",
              variant: "destructive",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
    };

    fetchCompanyName();
  }, []);

  const timeSlots = [
    "08.00",
    "08.30",
    "09.00",
    "09.30",
    "10.00",
    "10.30",
    "11.00",
    "13.00",
    "13.30",
    "14.00",
    "14.30",
    "15.00",
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:flex md:flex-row gap-4 justify-around"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <h1 className="mt-3">Select a Date and Time</h1>
                <p className="text-xs text-left text-gray-400">
                  Timezone: Western Indonesia Time (GMT+7)
                </p>
              </FormLabel>
              <FormControl>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  //weekend disabled (Saturday and Sunday)
                  disabled={(date) =>
                    // date <= new Date() ||
                    date.getDay() === 0 ||
                    date.getDay() === 6
                  }
                  initialFocus
                  className="w-full h-full"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <section className="grid grid-cols-2 items-center gap-4 mt-4">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      className={cn(
                        "text-black rounded-none border-2 shadow-none p-10",
                        field.value === time
                          ? "bg-blue-100 border-blue-500"
                          : "bg-transparent"
                      )}
                      onClick={() => field.onChange(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </section>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Booking Summary */}
        <section className="mt-5">
          <h1>Booking Summary</h1>
          <div className="border-t-2 mt-2 pt-2">
            {isLoading ? (
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <h1 className="font-bold">
                {companyName || "Company Name Not Available"}
              </h1>
            )}

            {/* Date and Time Display */}
            {form.watch("date") && form.watch("time") && (
              <>
                <p className="font-medium">
                  {form.watch("date").toLocaleDateString("en-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="text-sm mt-2 space-y-1">
                  {/* Time display helper function */}
                  {(() => {
                    const date = form.watch("date");
                    const timeString = form.watch("time");
                    const [hours, minutes] = timeString
                      .split(".")
                      .map((num) => parseInt(num));

                    // Create start time
                    const startTime = new Date(date);
                    startTime.setHours(hours, minutes || 0, 0, 0);

                    // Create end time (1 hour later)
                    const endTime = new Date(startTime);
                    endTime.setHours(endTime.getHours() + 1);

                    // Format times
                    const formatTime = (date: Date) => {
                      return date.toLocaleTimeString("en-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });
                    };

                    return (
                      <>
                        <div className="flex items-center">
                          <span className="font-medium"></span>
                          <span>
                            {formatTime(startTime)}-{formatTime(endTime)}
                          </span>
                        </div>
                        <p className="text-gray-500">Duration: 1 hour</p>
                      </>
                    );
                  })()}
                  <p className="text-xs text-gray-500">
                    Video Call ID: 455 037 094 805
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="py-[18px] px-[40%] my-4 shadow-lg shadow-[#36FFBF4D] bg-[#00CA87]"
            >
              {isSubmitting ? "Scheduling..." : "CONFRIM"}
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
};

export default CompanyScheduleForm;
