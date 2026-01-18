"use client";

import Link from "next/link";
import {
  ArrowRight,
  Plus
} from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";
import DashboardStatsComponent from "./DashboardStatsComponent";
import RecentVerificationActivityComponent from "./RecentVerificationActivityComponent";
import { useAuthStore } from "@components/website/auth/libs/useAuthStore";

export default function DashboardComponentPage() {
  const {activeAuditor} = useAuthStore()

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            Hello, {activeAuditor?.first_name ?? "dear"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's an overview of your property verifications"}
          </p>
        </div>

        <Button asChild>
          <Link href="/portal/verifications">
            <Plus className="h-4 w-4 mr-2" />
            New Verification
          </Link>
        </Button>
      </div>

      <DashboardStatsComponent></DashboardStatsComponent>

      {/* Recent Verification Activity */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between p-4 lg:p-5 border-b border-border">
          <h2 className="font-display font-semibold text-lg text-foreground">
            Recent Verification Activity
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal/verifications">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        <RecentVerificationActivityComponent></RecentVerificationActivityComponent>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickAction href="/portal/verifications" icon={FileCheck} title="View All Verifications" desc="Manage your property checks" />
        <QuickAction href="/portal/tasks" icon={ClipboardList} title="Track Tasks" desc={`${activeTasks} active tasks`} />
        <QuickAction href="/portal/chats" icon={CreditCard} title="Payments" desc="View your invoices and payments" />
      </div> */}
    </div>
  );
}

// function QuickAction({ href, icon: Icon, title, desc }: any) {
//   return (
//     <Link
//       href={href}
//       className="p-5 bg-card border border-border rounded-xl hover:shadow-soft group transition-all"
//     >
//       <div className="flex items-center gap-4">
//         <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
//           <Icon className="h-6 w-6 text-primary" />
//         </div>
//         <div>
//           <h3 className="font-display font-semibold text-foreground">{title}</h3>
//           <p className="text-sm text-muted-foreground">{desc}</p>
//         </div>
//       </div>
//     </Link>
//   );
// }
