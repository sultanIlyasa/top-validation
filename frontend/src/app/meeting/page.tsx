"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/lib/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import z from "zod";

// Validation schema using Zod
const meetingFormSchema = z.object({
  roomId: z.string().min(1, "Meeting ID is required"),
});

const MeetingPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      roomId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof meetingFormSchema>) => {
    const { roomId } = values;
    setIsLoading(true);

    try {
      // Validate the meeting first
      const { success, isValid } = await api.validateMeeting(roomId);

      if (success && isValid) {
        // Redirect to video call page
        router.push(`/video-call/${roomId}`);
      } else {
        throw new Error("Invalid meeting or not authorized");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to join meeting",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col mx-4 my-16 border rounded-lg shadow-sm p-3 sm:w-[60%] md:w-[40%] lg:w-[30%] sm:mx-auto">
      <Image
        src={"/meeting/video-call.png"}
        alt="video call logo"
        width={0}
        height={0}
        sizes="100vh"
        className="w-10 h-10 sm:w-[20%] md:w-[15%] lg:w-[10%] sm:h-auto my-auto"
      />
      <h1 className="font-bold my-1">Join a Meeting</h1>
      <p className="text-xs text-gray-400 mb-7">
        Please check your booking scheduler to see your meeting ID
      </p>
      <Form {...form}>
        <form
          id="meetingForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col mt-1 mb-1 md:grid md:gap-3"
        >
          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <p className="text-gray-500 text-xs mb-1">
                  Meeting ID<span className="text-red-700">*</span>
                </p>
                <FormControl>
                  <Input
                    type="text"
                    className="w-full"
                    placeholder="Enter your meeting ID"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="">
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg shadow-lg shadow-[#36FFBF4D] bg-[#00CA87] text-white h-10 w-[100%] md:w-[50%]  mx-auto border my-4 md:my-0"
            >
              {isLoading ? "Joining..." : "Join"}
            </Button>
            <Link href={"/"}>
              <Button
                type="button"
                className="rounded-lg shadow-lg text-gray-500 bg-white h-10 w-[100%] md:w-[50%] mx-auto border"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MeetingPage;
