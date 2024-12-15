'use client'
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Backend_URL } from "@/lib/Constants";

const updateFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  analyst: z
    .object({
      nikEmployee: z.string().optional(),
      position: z.string().optional(),
      superior: z.string().optional(),
    })
    .optional(),
});

interface CompanyProfileFormProps {
  onSubmit: (values: z.infer<typeof updateFormSchema>) => Promise<void>;
}

const CompanyProfileForm = ({ onSubmit }: CompanyProfileFormProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      analyst: {
        nikEmployee: "",
        position: "",
        superior: "",
      },
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(
            Backend_URL + `/users/${session.user.id}`
          );
          const userData = await response.json();

          form.reset({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            analyst: {
              nikEmployee: userData.analyst?.nikEmployee || "",
              position: userData.analyst?.position || "",
              superior: userData.analyst?.superior || "",
            },
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error appropriately
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [session, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form
        id="company-profile-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col my-8 md:grid md:grid-cols-2 md:gap-3"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                First Name<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="First Name *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Last Name <span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Last Name *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="analyst.nikEmployee"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Employee Number<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Employee Number *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="analyst.position"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Position<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Position *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="analyst.superior"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Superior<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Superior *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CompanyProfileForm;
