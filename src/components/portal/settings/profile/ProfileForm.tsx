"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@3rdparty/ui/form";
import { Input } from "@3rdparty/ui/input";
import { Button } from "@3rdparty/ui/button";
import { toast } from "@3rdparty/ui/use-toast";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/3rdparty/ui/select";
import z from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true;
      return /^\+?[\d\s\-()]{10,}$/.test(phone);
    }, "Invalid phone format"),
  country: z.string().min(1, "Country is required"),
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),
});

export default function ProfileForm() {
  const [profileSaving, setProfileSaving] = useState(false);

  // Countries and timezones data
  const countries = [
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "India", flag: "🇮🇳" },
  ];

  const timezones = [
    "UTC",
    "GMT+1 (WAT)",
    "GMT-5 (EST)",
    "GMT-8 (PST)",
    "GMT+9 (JST)",
    "GMT+10 (AEST)",
  ];

  const currencies = [
    { code: "USD", symbol: "$", flag: "🇺🇸" },
    { code: "NGN", symbol: "₦", flag: "🇳🇬" },
    { code: "GBP", symbol: "£", flag: "🇬🇧" },
    { code: "EUR", symbol: "€", flag: "🇪🇺" },
    { code: "CAD", symbol: "$", flag: "🇨🇦" },
    { code: "AUD", symbol: "$", flag: "🇦🇺" },
    { code: "JPY", symbol: "¥", flag: "🇯🇵" },
  ];

  // Form handlers
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+234 803 123 4567",
      country: "Nigeria",
      timezone: "GMT+1 (WAT)",
      currency: "NGN",
    },
  });

  const handleProfileSubmit = async (data: any) => {
    setProfileSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setProfileSaving(false);
    toast({
      title: "Profile updated successfully",
      description: "Your profile information has been saved.",
    });
    console.log("Profile data:", data);
  };

  return (
    <Form {...profileForm}>
      <form
        onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={profileForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={profileForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={profileForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+234 803 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={profileForm.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country">
                        {field.value &&
                          countries.find((c) => c.name === field.value) && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {
                                  countries.find((c) => c.name === field.value)
                                    ?.flag
                                }
                              </span>
                              <span>{field.value}</span>
                            </div>
                          )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.name} value={country.name}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency">
                        {field.value &&
                          currencies.find((c) => c.code === field.value) && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {
                                  currencies.find((c) => c.code === field.value)
                                    ?.flag
                                }
                              </span>
                              <span>{field.value}</span>
                            </div>
                          )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currency.flag}</span>
                          <span>
                            {currency.code} ({currency.symbol})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto min-w-32"
            disabled={profileSaving}
          >
            {profileSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
