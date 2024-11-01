"use client";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast, useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "../ui/button";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
      message: "Password must contain at least one letter and one number",
    }),
});

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      await login(values.email, values.password);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive", // Optional: change the variant to make it stand out
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-20">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  className="border-green-500 h-14 w-[80%] mx-auto border-2"
                  placeholder="Email address *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  className="border-green-500 h-14 w-[80%] mx-auto border-2"
                  placeholder="Password *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row-reverse mx-auto mr-10 my-4">
          <Link href={"#"} className="text-[#00CA87] text-sm">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="rounded-lg shadow-lg shadow-[#36FFBF4D] bg-[#00CA87] text-white h-12 w-[80%] mx-auto mt-4 block"
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
