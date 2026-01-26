'use client'

import { Button } from "@components/3rdparty/ui/button";
import { Shield, ArrowRight, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-accent/50 via-background to-background" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166856' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-up">
              <Shield className="w-4 h-4" />
              <span>{"Nigeria's Property Truth Layer"}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6 animate-fade-up stagger-1">
              Before You Pay.
              <span className="block text-primary mt-2">Verify It First.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 animate-fade-up stagger-2">
            {"Don't trust that agent. Don't trust that listing. Trust verified facts. We check property documents, ownership records, and satellite data so you don't get scammed."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up stagger-3">
              <Button variant="hero" size="xl" className="group">
                Verify a Property
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                See How It Works
              </Button>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 mt-10 animate-fade-up stagger-4">
              {["Registry Verified", "Satellite Checked", "Dispute-Free Guarantee"].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative lg:pl-8 animate-fade-up stagger-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="bg-card rounded-2xl shadow-floating p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground">Verification Complete</p>
                      <p className="text-sm text-muted-foreground">Lekki Phase 1, Lagos</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                    Verified ✓
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                    <p className="font-display text-2xl font-bold text-success">0.12</p>
                    <p className="text-xs text-success">Low Risk</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-1">Size Match</p>
                    <p className="font-display text-2xl font-bold text-foreground">98%</p>
                    <p className="text-xs text-muted-foreground">Confirmed</p>
                  </div>
                </div>

                {/* Verification Items */}
                <div className="space-y-3">
                  {[
                    { label: "Registry Ownership", status: "Verified" },
                    { label: "Survey Plan Match", status: "Verified" },
                    { label: "No Disputes Found", status: "Clear" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 px-3 bg-success/5 rounded-lg border border-success/20">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="text-xs font-medium text-success flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-elevated p-4 border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Verified</p>
                    <p className="font-display font-semibold text-foreground">2,847 Properties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;