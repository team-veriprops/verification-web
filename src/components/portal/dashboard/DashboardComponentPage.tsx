"use client";

import Link from "next/link";
import {
  FileCheck,
  Clock,
  AlertTriangle,
  CreditCard,
  ClipboardList,
  AlertCircle,
  ArrowRight,
  Plus,
  CheckCircle
} from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";
import StatsCard from "@components/portal/StatsCard";
import {
  mockUser,
  mockVerifications,
  mockTasks,
  mockDisputes,
  mockPayments,
  formatCurrency,
  getStatusBadgeColor
} from "@data/portalMockData";
import { Badge } from "@components/3rdparty/ui/badge";
import { cn } from "@lib/utils";

export default function DashboardComponentPage() {

  const totalVerifications = mockVerifications.length;
  const pendingVerifications = mockVerifications.filter(v => v.status === "pending").length;
  const verifiedCount = mockVerifications.filter(v => v.status === "verified").length;
  const flaggedCount = mockVerifications.filter(v => v.status === "flagged").length;

  const totalSpent = mockPayments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeTasks = mockTasks.filter(t => t.status === "in_progress" || t.status === "pending").length;
  const openDisputes = mockDisputes.filter(d => d.status === "active" || d.status === "under_review").length;

  const recentVerifications = mockVerifications.slice(0, 4);
  const firstName = mockUser.name.split(" ")[0];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            Hello, {firstName}!
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatsCard title="Total Verifications" value={totalVerifications} icon={FileCheck} variant="primary" />
        <StatsCard title="Pending" value={pendingVerifications} icon={Clock} />
        <StatsCard title="Verified" value={verifiedCount} icon={CheckCircle} variant="success" />
        <StatsCard title="Flagged" value={flaggedCount} icon={AlertTriangle} variant="danger" />
        <StatsCard title="Total Spent" value={formatCurrency(totalSpent)} icon={CreditCard} />
        <StatsCard title="Active Tasks" value={activeTasks} icon={ClipboardList} variant="warning" />
        <StatsCard title="Open Disputes" value={openDisputes} icon={AlertCircle} variant={openDisputes > 0 ? "danger" : "default"} />
      </div>

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

        <div className="divide-y divide-border">
          {recentVerifications.map((v) => {
            const Icon = getStatusBadgeColor(v.status);

            return (
              <div
                key={v.id}
                className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{v.id}</span>
                    <Badge className={cn("capitalize text-xs", Icon)}>
                      {v.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{v.location}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>

                <Button variant="outline" size="sm" asChild>
                  <Link href={`/portal/verifications/${v.id}`}>
                    View Report
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickAction href="/portal/verifications" icon={FileCheck} title="View All Verifications" desc="Manage your property checks" />
        <QuickAction href="/portal/tasks" icon={ClipboardList} title="Track Tasks" desc={`${activeTasks} active tasks`} />
        <QuickAction href="/portal/chats" icon={CreditCard} title="Payments" desc="View your invoices and payments" />
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, desc }: any) {
  return (
    <Link
      href={href}
      className="p-5 bg-card border border-border rounded-xl hover:shadow-soft group transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
