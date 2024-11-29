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
  company: z
    .object({
      companyName: z.string().optional(),
      positions: z.string().optional(),
      address: z
        .object({
          companyAddress: z.string().optional(),
          province: z.string().optional(),
          district: z.string().optional(),
          city: z.string().optional(),
          region: z.string().optional(),
          postcode: z.string().optional(),
          country: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        })
        .optional(),
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
      company: {
        companyName: "",
        positions: "",
        address: {
          companyAddress: "",
          province: "",
          district: "",
          city: "",
          region: "",
          postcode: "",
          country: "",
          latitude: 0,
          longitude: 0,
        },
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
            company: {
              companyName: userData.company?.companyName || "",
              positions: userData.company?.positions || "",
              address: {
                companyAddress: userData.company?.address?.companyAddress || "",
                province: userData.company?.address?.province || "",
                district: userData.company?.address?.district || "",
                city: userData.company?.address?.city || "",
                region: userData.company?.address?.region || "",
                postcode: userData.company?.address?.postcode || "",
                country: userData.company?.address?.country || "",
                latitude: userData.company?.address?.latitude || 0,
                longitude: userData.company?.address?.longitude || 0,
              },
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
          name="company.companyName"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Company Name<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Company Name *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company.address.country"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Country<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Country *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company.address.province"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Province<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Province *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company.address.city"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                City<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="City *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company.address.district"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                District<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="District *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.address.postcode"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Postal Code<span className="text-red-700">*</span>
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Postal Code *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company.address.companyAddress"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Company Address<span className="text-red-700">* </span>(full address)
              </p>
              <FormControl>
                <Input
                  type="text"
                  className=""
                  placeholder="Company Address *"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company.positions"
          render={({ field }) => (
            <FormItem>
              <p className="text-gray-500 text-xs mb-1">
                Position<span className="text-red-700">*</span> (e.g., CEO, CTO)
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
      </form>
    </Form>
  );
};

export default CompanyProfileForm;
