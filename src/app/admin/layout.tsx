"use client";

import { ReactNode, useState } from "react";
import { X } from "lucide-react";
import { SidebarProvider } from "@components/3rdparty/ui/sidebar";
import PortalSidebar from "@components/portal/PortalSidebar";
import PortalHeader from "@components/portal/PortalHeader";
import { useAuthQueries } from "@components/website/auth/libs/useAuthQueries";

export default function PortalLayout({ children }: { children: ReactNode }) {
    // Get Auth Details
  const { useGetAuth } = useAuthQueries();
  useGetAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <PortalSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Sidebar Panel */}
            <div className="absolute left-0 top-0 bottom-0 w-64 animate-fade-right">
              <div className="relative h-full">
                <PortalSidebar 
                  isMobile 
                  onClose={() => setMobileMenuOpen(false)} 
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <PortalHeader onMenuClick={() => setMobileMenuOpen(true)} />
          
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
