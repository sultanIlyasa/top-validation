import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-[#00332D]">
      <div className="flex flex-col md:flex-row md:justify-evenly">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={"/bixbox-logo.png"}
            width={100}
            height={100}
            alt="logo-bixbox"
            className="mt-12"
          ></Image>
          <p className="text-white text-xs my-3">
            Butuh bantuan? Hubungi kami melalui:
          </p>
          {/* Whatsapp Bixbox */}
          <div className="flex flex-row gap-3 my-3">
            <Image
              src={"/footer/whatsapp-footer.png"}
              width={35}
              height={31}
              alt="logo WA"
              className="w-[35px] h-[31px]"
            ></Image>
            <div className="flex flex-col">
              <p className="text-[#00CA87] text-base font-semibold ">
                WhatsApp Bixbox
              </p>
              <p className="text-white text-xs">Setiap Hari, 08.00 - 21.00</p>
            </div>
          </div>

          {/* Nomor Bixbox */}
          <div className="flex flex-row gap-3 my-3">
            <Image
              src={"/footer/phone-footer.png"}
              width={30}
              height={30}
              alt="phone logo"
              className="w-[35px] h-[33px]"
            ></Image>
            <div className="flex flex-col">
              {" "}
              <p className="text-[#00CA87] text-base font-semibold ">
                +628811688355
              </p>
              <p className="text-white text-xs">Setiap Hari, 08.00 - 21.00</p>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="mt-10 md:hidden">
          <Accordion type="single" collapsible>
            <AccordionItem
              value="item-1"
              className="border-t border-[#006558] "
            >
              <AccordionTrigger className="text-[#00CA87] mx-4">
                Perusahaan
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 mx-4 text-white">
                <Link href={"#"}>Our Values</Link>
                <Link href={"#"}>Contact</Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-[#006558]">
              <AccordionTrigger className="text-[#00CA87] mx-4">
                Keterangan
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 mx-4 text-white">
                <Link href={"#"}>Terms & Condition</Link>
                <Link href={"#"}>FAQ</Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="hidden md:flex mt-12">
          <div className="flex flex-col gap-2 mx-4 text-white">
            <h1 className="text-[#00CA87]">Perusahaan</h1>
            <Link href={"#"}>Our Values</Link>
            <Link href={"#"}>Contact</Link>
          </div>
        </div>
        <div className="hidden md:flex mt-12">
          <div className="flex flex-col gap-2 mx-4 text-white">
            <h1 className="text-[#00CA87]">Keterangan</h1>
            <Link href={"#"}>Terms & Condition</Link>
            <Link href={"#"}>FAQ</Link>
          </div>
        </div>

        {/* Newsletter feature */}
        <div className="mx-4">
          <p className="text-[#00CA87] text-base font-semibold my-3 md:mt-12">
            Stay Informed, Stay Ahead.
          </p>
          {/* Implement newslatter feature */}
          <p className="text-white text-sm">
            Dapatkan berita terbaru dan penawaran eksklusif BixBox <br />{" "}
            langsung ke email Anda!
          </p>
          <div className="flex flex-row items-center justify-center my-4 gap-10">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="bg-white p-1 w-[70%] rounded-2xl placeholder:text-slate-400 placeholder:text-sm placeholder:px-2"
            />
            <button className=" text-white p-2 rounded-2xl" title="Send">
              <Image
                src={"/footer/mail.png"}
                width={20}
                height={20}
                alt="send"
              ></Image>
            </button>
          </div>
          <div className="flex flex-row gap-3">
            <Image
              src={"/footer/instagram.png"}
              width={30}
              height={30}
              alt="instagram"
              className="w-[28px] h-[28px]"
            ></Image>
            <Image
              src={"/footer/twitter.png"}
              width={30}
              height={0}
              alt="instagram"
              className="w-[31px] h-[30px]"
            ></Image>
            <Image
              src={"/footer/youtube.png"}
              width={30}
              height={30}
              alt="instagram"
              className="w-[31px] h-[30px]"
            ></Image>
            <Image
              src={"/footer/facebook.png"}
              width={30}
              height={15}
              alt="instagram"
              className="w-[31px] h-[30px]"
            ></Image>
          </div>
        </div>
      </div>

      {/* Payment partners */}
      <div className="bg-[#002621] flex flex-col md:flex-row md:justify-center items-center md:mt-16 py-5 text-white">
        <p className="mb-8 md:mb-0">&copy; 2024 BixBox. All Rights Reserved</p>
        <div className=" mx-4 grid grid-cols-5 gap-1 md:flex md:flex-row">
          <Image
            src="/footer/visa.png"
            width={60}
            height={30}
            alt="visa"
            className="h-[30px]"
          />
          <Image
            src="/footer/mastercard.png"
            width={60}
            height={30}
            alt="mastercard"
            className="h-[30px]"
          />
          <Image
            src="/footer/bca.png"
            width={60}
            height={30}
            alt="bca"
            className="h-[30px]"
          />
          <Image
            src="/footer/mandiri.png"
            width={60}
            height={30}
            alt="mandiri"
            className="h-[30px]"
          />
          <Image
            src="/footer/bni.png"
            width={60}
            height={30}
            alt="bni"
            className="h-[30px]"
          />
          <div className="mx-4 col-start-2 col-span-3 flex justify-center gap-2 md:mx-0 md:gap-1">
            <Image
              src="/footer/bri.png"
              width={60}
              height={30}
              alt="bri"
              className="h-[30px]"
            />
            <Image
              src="/footer/permata.png"
              width={60}
              height={30}
              alt="permata"
              className="h-[30px]"
            />
            <Image
              src="/footer/batumbu.png"
              width={60}
              height={30}
              alt="batumbu"
              className="h-[30px]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
