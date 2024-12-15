"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Backend_URL } from "@/lib/Constants";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      const res = await fetch(Backend_URL + "/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast({
        title: "Check Your Email",
        description:
          "If this email is registered, a password reset link has been sent to it.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto min-h-screen flex items-center justify-center">
      <Card className="px-12 py-6 my-10 w-fit md:w-[35%] lg:w-fit lg:max-w-[610px] h-full border-[#006558] rounded-3xl border-2">
        <CardHeader>
          <CardTitle className="ffont-bold text-xl md:text-3xl md:font-extrabold text-[#00491E] mt-3">
            Forgot your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mt-20">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-80"
            >
              <Input
                placeholder="Email address"
                {...form.register("email")}
                className="border-green-500 h-14 w-[100%] mx-auto border-2"
              />
              <Button
                type="submit"
                className="text-lg rounded-lg shadow-lg shadow-[#36FFBF4D] bg-[#00CA87] text-white h-12 w-[100%] mx-auto mt-4 block hover:bg-[#00CA87]/70 hover:text-white"
              >
                Request Reset Link
              </Button>
              <Link href={"/auth/login"}>
                <Button
                  type="button"
                  className="text-lg rounded-lg shadow-lg shadow-input bg-white border-input border-2 text-black/50 font-bold h-12 w-[100%] mx-auto mt-4 block hover:bg-white hover:text-input"
                >
                  Back to Login
                </Button>
              </Link>
            </form>
          </div>
        </CardContent>
        {/* <div className="flex flex-col items-center">
          <Button className="py-[18px] px-[100px] my-4 shadow-lg shadow-[#36FFBF4D] bg-[#00CA87] ">
            Submit
          </Button>
        </div> */}
        <div className="flex flex-row items-center justify-center mt-4">
          <Link href={"#"} className="text-xs text-gray-500">
            Terms of user
          </Link>
          <p className="text-xs mx-2"> | </p>
          <Link href={"#"} className="text-xs text-gray-500">
            Privacy policy
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center mt-4 mb-7 text-gray-500 font-semibold text-xs">
          <Link href={"#"} className="pl-4">
            +62 881 1688 355
          </Link>
          <p className="text-sm"> | </p>
          <Link href={"#"} className="">
            Chat dengan CS Bixbox
          </Link>
        </div>
      </Card>
    </div>
  );
}
