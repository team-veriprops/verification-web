"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@3rdparty/ui/tabs";
import { motion } from "framer-motion";
import { PageDetails } from "types/models";
import PageHeader from "@components/ui/PageHeader";
import { useUserStore } from "./libs/useUserStore";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import UsersTable from "./UserTable";
import { BadgeDollarSign, Shield, ShieldUser, UserSearch } from "lucide-react";
import { UserPersona, UserType } from "./models";

export enum UserCategory {
  ALL = "all",
  BUYERS = "buyers",
  AGENTS = "agents",
  ADMIN = "admin",
}

const userStats = {
  all: 40,
  buyers: 13,
  agents: 8,
  admin: 3
}

export default function UserComponentPage({ title, description }: PageDetails) {
  // const { filters, updateFilters } = useVerificationStore();
  // const { settings } = useGlobalSettings();
  // const { useGetDashboardStats } = useDashboardQueries();
  // const { data: dashboardStats} = useGetDashboardStats();
  // const searchParams = useSearchParams();


  const { settings } = useGlobalSettings();
  // const { updateFilters: updateRoleFilters } = useRoleStore();
  const { updateFilters, activeTab, setActiveTab } = useUserStore();

  const verificationTabs: Array<{
    key: UserCategory;
    userType: UserType | "all";
    persona: UserPersona;
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
  }> = [
    { key: UserCategory.ALL,    userType: "all",         persona: UserPersona.GUEST, icon: UserSearch , label: `${UserCategory.ALL} (${userStats?.all ?? 0})` },
    { key: UserCategory.BUYERS, userType: UserType.USER, persona: UserPersona.BUYER, icon: BadgeDollarSign , label: `${UserCategory.BUYERS} (${userStats?.buyers ?? 0})` },
    { key: UserCategory.AGENTS, userType: UserType.USER, persona: UserPersona.VERIFIER, icon: Shield, label: `${UserCategory.AGENTS} (${userStats?.agents ?? 0})` },
    { key: UserCategory.ADMIN, userType: UserType.ADMIN, persona: UserPersona.GUEST, icon: ShieldUser ,  label: `${UserCategory.ADMIN} (${userStats?.admin ?? 0})` },
  ] as const;

  const verificationTabByKey = Object.fromEntries(
  verificationTabs.map(tab => [tab.key, tab])
) as Record<UserCategory, (typeof verificationTabs)[number]>;

  const onTabChange = (key: UserCategory) => {
    setActiveTab(key)

    const tab = verificationTabByKey[key];
    updateFilters({
      userType: tab.userType as UserType,
      persona: tab.persona,
      page: settings.firstPage,
    })
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <PageHeader title={title} description={description} />
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  onTabChange(value as UserCategory)
                }
                className="space-y-6 mt-14"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <TabsList className="bg-muted/50 p-1">
                    {verificationTabs.map(({ key, icon: Icon, label }) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className={"capitalize"}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div></div>
                </div>
      
                {verificationTabs.map(({ key }) => (
                  <TabsContent key={key} value={key} className="space-y-6">
                    <UsersTable />
                  </TabsContent>
                ))}
              </Tabs>

      {/* <Tabs
        value={activeTab}
        onValueChange={(value) => {
          updateRoleFilters({ page: settings.firstPage });
          updateUserFilters({ page: settings.firstPage });
          setActiveTab(value)
        }}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <MembersTable />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <RolesTable />
        </TabsContent>
      </Tabs> */}
    </motion.div>
  );
}
