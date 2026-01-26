'use client'

import { PricingTier, pricingTiers } from "@data/mockData";
import { Button } from "@components/3rdparty/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Launch Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the verification level that fits your needs. All plans include our core verification process.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier: PricingTier, index: number) => (
            <div
              key={tier.name}
              className={`relative bg-card rounded-2xl border overflow-hidden opacity-0 animate-fade-up ${
                tier.popular 
                  ? "border-primary shadow-floating scale-105 z-10" 
                  : "border-border shadow-soft"
              }`}
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 gradient-hero text-center py-2">
                  <span className="text-primary-foreground text-sm font-semibold">Most Popular</span>
                </div>
              )}

              <div className={`p-6 ${tier.popular ? "pt-14" : ""}`}>
                {/* Tier Header */}
                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {formatPrice(tier.price)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">/ property</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                        tier.popular ? "text-primary" : "text-success"
                      }`} />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={tier.popular ? "hero" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Choose {tier.name}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Need verification for multiple properties?{" "}
            <a href="#" className="text-primary font-medium hover:underline">Contact us for bulk pricing</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;