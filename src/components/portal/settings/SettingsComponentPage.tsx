import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Suspense } from "react";
import NotificationPreferences from "./notifications/NotificationPreferences";
import NotificationsSkeleton from "./notifications/skeletons/NotificationsSkeleton";
import ProfileTabsContentSkeleton from "./profile/skeletons/ProfileTabsContentSkeleton";
import SecurityTabsContentSkeleton from "./security/skeletons/SecurityTabsContentSkeleton";
import { Bell, Shield, User } from "lucide-react";
import ProfileTabsContent from "./profile/ProfileTabsContent";
import SecurityTabsContent from "./security/SecurityTabsContent";
import { PageDetails } from "types/models";
import PageHeader from "@components/ui/PageHeader";

export default function SettingsComponentPage({
  title,
  description,
  active_tab,
}: PageDetails) {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={title} description={description} active_tab={""} />

      <Tabs defaultValue={active_tab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1 rounded-lg h-auto">
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <User className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Shield className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Bell className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline truncate">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="profile"
          className="space-y-10 md:px-8 xl:px-32 2xl:px-48 animate-fade-in focus:outline-none"
        >
          <Suspense fallback={<ProfileTabsContentSkeleton />}>
            <ProfileTabsContent />
          </Suspense>
        </TabsContent>

        <TabsContent
          value="security"
          className="space-y-10 md:px-8 xl:px-32 2xl:px-48 animate-fade-in focus:outline-none"
        >
          <Suspense fallback={<SecurityTabsContentSkeleton />}>
            <SecurityTabsContent />
          </Suspense>
        </TabsContent>

        <TabsContent 
          value="notifications" 
          className="space-y-10 md:px-8 xl:px-32 2xl:px-48 animate-fade-in"
          >
          <Suspense fallback={<NotificationsSkeleton />}>
            <NotificationPreferences />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
