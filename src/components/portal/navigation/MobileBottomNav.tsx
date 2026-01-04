"use client";

import Link from "next/link";
import {
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@3rdparty/ui/sheet";
import { bottomNavItems, moreMenuItems } from "./NavItems";

export default function MobileBottomNav() {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50`}
    >
      <div className="flex items-center justify-around py-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon as any;
          if (item.name === "More") {
            return (
              <Sheet key={item.name}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center p-2 min-w-[60px]">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">
                      {item.label}
                    </span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[60vh]">
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-4">More Options</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {moreMenuItems.map((moreItem) => {
                        const Icon2 = moreItem.icon as any;
                        return (
                          <Link
                            key={moreItem.path}
                            href={moreItem.path}
                            className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Icon2 className="h-6 w-6 mb-2" />
                            <span className="text-sm text-center">
                              {moreItem.name}
                            </span>
                          </Link>
                        );
                      })}

                      <button className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors">
                        <LogOut className="h-6 w-6 mb-2" />
                        <span className="text-sm text-center">Logout</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center p-2 min-w-[60px]`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
