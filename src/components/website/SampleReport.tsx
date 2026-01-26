'use client'

import { Shield, CheckCircle, MapPin, FileText, User, Calendar, Download, Award } from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";

const SampleReport = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              Verification Report
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              What Your Report Looks Like
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {"Every verified property comes with a detailed PDF report that you can share with lawyers, banks, or keep for your records. Here's a preview of what you'll receive."}
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "Detailed ownership verification results",
                "Survey plan comparison with satellite data",
                "Dispute check from court records",
                "GPS coordinates of property boundaries",
                "Official Veriprops verification stamp",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg">
              Get Your Report
            </Button>
          </div>

          {/* Right Content - Report Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl" />
            <div className="relative bg-card rounded-2xl shadow-floating border border-border overflow-hidden">
              {/* Report Header */}
              <div className="gradient-hero p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-primary-foreground text-lg">VERIPROPS</h3>
                      <p className="text-primary-foreground/80 text-sm">Property Verification Report</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-foreground/60 text-xs">Report ID</p>
                    <p className="font-mono text-primary-foreground font-medium">VP-2024-001</p>
                  </div>
                </div>
              </div>

              {/* Report Body */}
              <div className="p-6 space-y-6">
                {/* Property Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground text-sm">Lekki Phase 1, Lagos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Property Type</p>
                      <p className="font-medium text-foreground text-sm">Residential Land</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Registered Owner</p>
                      <p className="font-medium text-foreground text-sm">John A. ••••••</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Verified On</p>
                      <p className="font-medium text-foreground text-sm">December 15, 2024</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-border" />

                {/* Verification Summary */}
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-3">Verification Summary</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3 text-center">
                      <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Ownership</p>
                      <p className="font-semibold text-success text-sm">Verified</p>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3 text-center">
                      <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Survey</p>
                      <p className="font-semibold text-success text-sm">Matched</p>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3 text-center">
                      <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Disputes</p>
                      <p className="font-semibold text-success text-sm">None</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-border" />

                {/* Size Comparison */}
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-3">Size Comparison</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Claimed Size</span>
                      <span className="font-medium text-foreground">600 sqm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Survey Document</span>
                      <span className="font-medium text-foreground">580 sqm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Satellite Estimate</span>
                      <span className="font-medium text-foreground">590 sqm</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm font-medium text-foreground">Variance</span>
                      <span className="font-semibold text-success">-1.7% (Acceptable)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Footer */}
              <div className="bg-muted/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium text-foreground">Veriprops Verified</span>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Download className="w-4 h-4 mr-1" />
                  Sample Only
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SampleReport;