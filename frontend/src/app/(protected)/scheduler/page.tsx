"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Calendar } from "@/components/ui/calendar";

// handle the date picker
const datePicker = () => {};

// handle time picker
const timePicker = () => {};

//  Don't forget to add documentation to the code
const schedulerPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="mx-5 min-h-screen mt-10">
      <h1 className="font-bold text-left">Schedule Virtual Meetings Online</h1>
      <p className="text-xs text-left ">
        Check out our availability and book the date and time that works for you
      </p>
      <div className="flex flex-col md:flex-row gap-6 justify-around">
        <div className="">
          <h1 className="mt-3">Select a Date and Time</h1>
          <p className="text-xs text-left text-gray-400">
            Timezone: Western Indonesia Time (GMT+7)
          </p>
          {/* Date picker remember to add function that stores the picked date for admin and function date picker for the customer */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        {/* Time picker Remember to add the pick time function */}
        {/* Pick the hour and then push the database with the value of time and datej */}
        <section className="grid grid-cols-2 items-center gap-4 mt-4">
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none ">
            08.00
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            08.30
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            09.00
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            09.30
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            10.00
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            10.30
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            11.00
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            13.00
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            13.30
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            14.00
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            14.30
          </Button>
          <Button className="text-black bg-transparent rounded-none border-2 shadow-none">
            15.00
          </Button>
        </section>

        {/* Booking Summary (Fetch all the data here to better send API) */}
        <section className="mt-5 ">
          <h1>Booking Summary</h1>
          <div className="border-t-2 mt-2 pt-2">
            <h1 className="font-bold">PT Pabrik Kertas Tjiwi Kimia</h1>
            <p>15 October 2024</p>
            <div className="text-xs">
              <p>1 hour</p>
              <p>Video Call ID: 455 037 094 805</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Button className="py-[18px] px-[40%] my-4 shadow-lg shadow-[#36FFBF4D] bg-[#00CA87] ">
              Next
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default schedulerPage;
