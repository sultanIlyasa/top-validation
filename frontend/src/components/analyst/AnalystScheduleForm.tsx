import React from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Backend_URL } from "@/lib/Constants";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  company: {
    firstName: string;
    lastName: string;
    company: {
      companyName: string;
    };
  };
}

const FormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  selectedSchedule: z.string().optional(),
});

const AnalystScheduleForm = () => {
  const { data: session } = useSession();
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [selectedDateSchedules, setSelectedDateSchedules] = React.useState<
    Schedule[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const fetchSchedules = React.useCallback(async () => {
    try {
      const response = await fetch(
        Backend_URL + `/schedule/available/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.backendTokens.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const data = await response.json();
      setSchedules(data);

      const selectedDate = form.getValues("date");
      if (selectedDate) {
        updateSelectedDateSchedules(selectedDate, data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to load schedules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, form]);

  React.useEffect(() => {
    if (session) {
      fetchSchedules();
    }
  }, [session, fetchSchedules]);

  const updateSelectedDateSchedules = (
    date: Date,
    scheduleList: Schedule[]
  ) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const filteredSchedules = scheduleList.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      scheduleDate.setHours(0, 0, 0, 0);
      return scheduleDate.getTime() === selectedDate.getTime();
    });

    // Sort schedules by start time
    const sortedSchedules = filteredSchedules.sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    setSelectedDateSchedules(sortedSchedules);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("date", date);
      form.setValue("selectedSchedule", undefined);
      updateSelectedDateSchedules(date, schedules);
    }
  };

  const handleStatusChange = async (status: "CONFIRMED" | "REJECTED") => {
    const selectedScheduleId = form.getValues("selectedSchedule");
    if (!selectedScheduleId || !session?.user?.id) return;

    setProcessingId(selectedScheduleId);
    try {
      const response = await fetch(
        Backend_URL + `/schedule/update/${selectedScheduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.backendTokens.access_token}`,
          },
          body: JSON.stringify({
            analystId: session.user.id,
            status,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update schedule");
      }

      toast({
        title: "Success",
        description: `Schedule ${status.toLowerCase()} successfully`,
      });

      fetchSchedules();
      form.setValue("selectedSchedule", undefined);
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update schedule",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const hasSchedules = (date: Date) => {
    return schedules.some((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate.getUTCDate() === date.getUTCDate() &&
        scheduleDate.getUTCMonth() === date.getUTCMonth() &&
        scheduleDate.getUTCFullYear() === date.getUTCFullYear()
      );
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const CustomDay = (props: {
    date: Date;
    displayMonth: Date;
    selected: boolean;
  }) => {
    const hasSchedulesForDay = hasSchedules(props.date);
    return (
      <div
        className={cn(
          "w-full h-full p-2 flex items-center justify-center relative",
          props.selected && "bg-blue-100 text-blue-900 rounded-md",
          hasSchedulesForDay &&
            "after:absolute after:bottom-1 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-blue-500"
        )}
      >
        {props.date.getDate()}
      </div>
    );
  };

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
  ];

  // Convert time slot to a Date object for comparison
  const timeSlotToDate = (date: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="md:flex md:flex-row gap-4 justify-around">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <h1 className="mt-3">Select a Date to View Schedules</h1>
                <p className="text-xs text-left text-gray-400">
                  Timezone: Western Indonesia Time (GMT+7)
                </p>
              </FormLabel>
              <FormControl>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="w-full h-full"
                  components={{
                    DayContent: (props) => (
                      <CustomDay
                        date={props.date}
                        displayMonth={props.displayMonth}
                        selected={
                          field.value?.getTime() === props.date.getTime()
                        }
                      />
                    ),
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selectedSchedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {" "}
                <p className="text-xs text-left">
                  Check out our availability and book the date and time that
                  works for you
                </p>
              </FormLabel>
              <FormControl>
                <section className="grid grid-cols-3 gap-4 mt-4">
                  {timeSlots.map((timeSlot) => {
                    const timeSlotDate = timeSlotToDate(
                      form.getValues("date"),
                      timeSlot
                    );
                    const schedule = selectedDateSchedules.find((schedule) => {
                      const scheduleStartTime = new Date(schedule.startTime);
                      return (
                        scheduleStartTime.getTime() === timeSlotDate.getTime()
                      );
                    });

                    const isSelected = field.value === schedule?.id;
                    const hasAppointment = !!schedule;
                    const isNotSelectable = !hasAppointment || isSelected;

                    return (
                      <Button
                        key={timeSlot}
                        type="button"
                        className={cn(
                          "rounded-none border-2 shadow-none p-6",
                          isSelected &&
                            "bg-[#FF5F00] border-blue-500 text-white",
                          isNotSelectable &&
                            "bg-[#FF5F00] border-gray-200 text-white",
                          hasAppointment &&
                            !isSelected &&
                            "bg-[#FFCB05] text-white",
                          !hasAppointment && "bg-transparent text-gray-400"
                        )}
                        onClick={() => field.onChange(schedule?.id)}
                      >
                        <div className="flex flex-col items-center">
                          <span>{timeSlot}</span>
                          {/* {hasAppointment ? (
                            <span className="text-sm">
                              {schedule.company.company.companyName}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No Appointment
                            </span>
                          )} */}
                        </div>
                      </Button>
                    );
                  })}
                </section>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Booking Details */}
        <section className="mt-5 w-full md:w-1/3">
          <h1 className="font-bold mb-4">Appointment Details</h1>
          {form.watch("selectedSchedule") ? (
            <div className="border p-4 rounded-lg">
              {(() => {
                const schedule = selectedDateSchedules.find(
                  (s) => s.id === form.watch("selectedSchedule")
                );
                if (!schedule) return null;

                return (
                  <>
                    <h2 className="font-semibold text-lg">
                      {schedule.company.company.companyName}
                    </h2>
                    <p className="text-gray-600">
                      {schedule.company.firstName} {schedule.company.lastName}
                    </p>
                    <p className="mt-2">
                      {new Date(schedule.date).toLocaleDateString("en-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm mt-1">
                      {formatTime(schedule.startTime)}
                      {" - "}
                      {formatTime(schedule.endTime)}
                    </p>
                    <div className="mt-4 flex gap-2 justify-end">
                      <Button
                        onClick={() => handleStatusChange("REJECTED")}
                        variant="destructive"
                        disabled={processingId === schedule.id}
                        className="w-24"
                      >
                        {processingId === schedule.id ? "..." : "Reject"}
                      </Button>
                      <Button
                        onClick={() => handleStatusChange("CONFIRMED")}
                        className="w-24 bg-[#00CA87] hover:bg-[#00B377]"
                        disabled={processingId === schedule.id}
                      >
                        {processingId === schedule.id ? "..." : "Accept"}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {form.getValues("date")
                  ? "Please select an appointment time"
                  : "Please select a date to view available appointments"}
              </p>
            </div>
          )}
        </section>
      </form>
    </Form>
  );
};

export default AnalystScheduleForm;
