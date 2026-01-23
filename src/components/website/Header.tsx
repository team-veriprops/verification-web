'use client'

import { Button } from "@components/3rdparty/ui/button";
import { Shield, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "./auth/libs/useAuthStore";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {activeAuditor} = useAuthStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-shadow">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Veriprops
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              How it Works
            </Link>
            <Link href="#verification" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Verification
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Testimonials
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {activeAuditor?.id ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/portal/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm">
                <Link href={"/auth/sign-in"}>Login</Link>
              </Button>
            )}
            
            <Button variant="default" size="sm">
              <Link href={"/portal/verifications?add=1"}>Verify a Property</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <nav className="flex flex-col gap-4">
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                How it Works
              </Link>
              <Link href="#verification" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                Verification
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                Testimonials
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {activeAuditor?.id ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/portal/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" className="justify-start">
                        <Link href={"/auth/sign-in"}>Login</Link>
                      </Button>
                      <Button variant="default">
                        <Link href={"/portal/verifications?add=1"}>Verify a Property</Link>
                      </Button>
                    </>
                  )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;