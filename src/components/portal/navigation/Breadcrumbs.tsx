"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ pathname }: { pathname: string | null }) {
  const parts = (pathname || "").split("/").filter(Boolean);
  const crumbs = [{ name: "Dashboard", path: "/portal/dashboard" }];

  if (pathname === "/portal/dashboard" || parts.length === 0)
    return (
      <nav className="flex items-center space-x-2 text-sm">
        <Link href="/portal/dashboard" className="text-foreground font-medium">
          Dashboard
        </Link>
      </nav>
    );

  // parse second segment
  const last = parts[parts.length - 1];
  crumbs.push({
    name: last.charAt(0).toUpperCase() + last.slice(1),
    path: pathname || "/portal",
  });

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {crumbs.map((crumb, i) => (
        <div key={crumb.path} className="flex items-center space-x-2">
          {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <Link
            href={crumb.path}
            className={
              i === crumbs.length - 1
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {crumb.name}
          </Link>
        </div>
      ))}
    </nav>
  );
}
