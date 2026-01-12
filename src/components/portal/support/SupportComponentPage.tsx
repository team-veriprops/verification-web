"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/3rdparty/ui/tabs";
import { TableOfContents, Contact } from "lucide-react";

import { PageDetails } from "types/models";
import PageHeader from "@components/ui/PageHeader";
import FaqTabsContent from "./faq/FaqTabsContent";
import ContactTabsContent from "./contact/ContactTabsContent";

export default function SupportComponentPage({
  title,
  description
}: PageDetails) {

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader title={title} description={description} active_tab={""} />

      {/* Tabs */}
      <Tabs defaultValue="faq" className="space-y-6">

        <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1 rounded-lg h-auto">
          <TabsTrigger
            value="faq"
            className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <TableOfContents className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">FAQ</span>
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Contact className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Contact Us</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ TAB */}
        <TabsContent 
          value="faq"
          className="space-y-10 md:px-8 xl:px-32 2xl:px-48 animate-fade-in"
        >
          <FaqTabsContent></FaqTabsContent>
        </TabsContent>

        {/* CONTACT TAB */}
        <TabsContent 
          value="contact" 
          className="space-y-10 md:px-8 xl:px-32 2xl:px-48 animate-fade-in"
        >
          <ContactTabsContent></ContactTabsContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
