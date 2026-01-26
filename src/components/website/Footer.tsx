'use client'

import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="bg-primary/10 rounded-2xl p-8 md:p-12 mb-16 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-background mb-4">
            Ready to Verify Your Next Property?
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-6">
            {"Don't risk your money on unverified properties. Get the facts before you pay."}
          </p>
          <Button variant="gold" size="xl">
            Start Verification Now
          </Button>
        </div>

        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-background">
                Veriprops
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              {"Nigeria's Property Truth Layer. We exist to prevent property scams and bring transparency to real estate transactions across Nigeria."}
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5 text-background/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["How It Works", "Pricing", "Sample Reports", "FAQs", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/60 hover:text-background transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Refund Policy", "Data Protection"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/60 hover:text-background transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-background/40 shrink-0 mt-0.5" />
                <span className="text-background/60 text-sm">
                  14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-background/40 shrink-0" />
                <a href="tel:+2341234567890" className="text-background/60 hover:text-background transition-colors text-sm">
                  +234 812 345 6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-background/40 shrink-0" />
                <a href="mailto:hello@veriprops.ng" className="text-background/60 hover:text-background transition-colors text-sm">
                  hello@veriprops.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © {new Date().getFullYear()} Veriprops. All rights reserved.
          </p>
          <p className="text-background/40 text-sm text-center md:text-right">
            Protecting Nigerian property buyers, one verification at a time. 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;