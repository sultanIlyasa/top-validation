import React from "react";
import Image from "next/image";

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
const date = new Date().toLocaleDateString(undefined, options); // Get the current date

const CompanyDashboardPanel = () => {
  return (
    <div className="flex mx-auto w-[90%]  sm:w-[70%]  lg:w-[50%] xl:w-[40%] h-full border border-green-700 my-4 rounded-xl px-1 py-2">
      <div className="grid grid-cols-2 space-x-1 w-full  ">
        <div className="flex flex-row border-r ">
          <Image
            src="/dashboard/videocall_icon.png"
            alt="Video call icon"
            width={36}
            height={20}
            className="sm:w-[40px]"
          ></Image>
          <div className="flex flex-col mx-2">
            <p className="text-left text-[10px] sm:text-base font-extralight">
              Video Call Meet
            </p>
            <p className="text-[8px] sm:text-sm ">15 Minutes</p>
          </div>
        </div>
        <div className="flex flex-row">
          <Image
            src="/dashboard/schedule_icon.png"
            alt="Video call icon"
            width={36}
            height={20}
            className="sm:w-[40px]"
          ></Image>
          <div className="flex flex-col mx-2 ">
            <p className=" text-left text-[10px] sm:text-base font-extralight">
              Date and Time
            </p>
            <p className="text-[8px] sm:text-sm ">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPanel;
