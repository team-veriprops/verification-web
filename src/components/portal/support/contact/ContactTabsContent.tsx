import { Button } from "@components/3rdparty/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/3rdparty/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/3rdparty/ui/select";
import { Textarea } from "@components/3rdparty/ui/textarea";
import { toast } from "@components/3rdparty/ui/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/3rdparty/ui/form";

const contactFormSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactTabsContent() {
  const [messageSending, setMessageSending] = useState(false);

  // Form handlers
  const contactForm = useForm({
      resolver: zodResolver(contactFormSchema),
      defaultValues: {
        topic: "",
    message: "",
      },
  });

  const handleMessageSubmit = async (data: any) => {

    setMessageSending(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setMessageSending(false);

    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
    console.log("Message data:", data)
  };

  return (
    <>
      <Card className="border border-border py-4">
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">

           <FormProvider  {...contactForm}>
  <form
    onSubmit={contactForm.handleSubmit(handleMessageSubmit)}
    className="space-y-4"
  >
    {/* Topic Field */}
    <FormField
      control={contactForm.control}
      name="topic"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Topic</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="verification">Verification Issue</SelectItem>
              <SelectItem value="payment">Payment Issue</SelectItem>
              <SelectItem value="dispute">Dispute Help</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Message Field */}
    <FormField
      control={contactForm.control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Message</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Describe your issue..."
              rows={5}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Submit Button */}
    <div className="flex justify-end">
      <Button
        type="submit"
        className="w-full sm:w-auto min-w-32"
        disabled={messageSending}
      >
        {messageSending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Sending...
          </div>
        ) : (
          "Send Message"
        )}
      </Button>
    </div>
  </form>
</FormProvider>
            </div>
           
        </CardContent>
      </Card>

      <Card className="border border-border py-4">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <a 
              href="mailto:support@veriprops.ng" 
              className="text-sm text-blue-600 hover:underline"
            >
              support@veriprops.ng
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <a 
              href="tel:+2348001234567" 
              className="text-sm text-blue-600 hover:underline"
            >
              +234 800 123 4567
            </a>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <a
              href="https://maps.google.com/?q=Lagos,Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Lagos, Nigeria
            </a>
          </div>

        </CardContent>
      </Card>
    </>
  );
}
