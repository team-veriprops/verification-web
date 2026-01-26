import { FileSearch, Database, Shield, FileText, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    title: "Submit Property Details",
    description: "Share the property location, documents, and seller information you want verified.",
    color: "primary",
  },
  {
    icon: Database,
    title: "We Cross-Check Records",
    description: "Our team checks land registries, survey plans, and satellite data for discrepancies.",
    color: "secondary",
  },
  {
    icon: Shield,
    title: "Risk Analysis Complete",
    description: "We flag disputes, ownership issues, and size mismatches with a clear risk score.",
    color: "success",
  },
  {
    icon: FileText,
    title: "Get Your Report",
    description: "Receive a detailed verification report with our findings and recommendation.",
    color: "primary",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How Verification Works
          </h2>
          <p className="text-lg text-muted-foreground">
            {"We do the hard work so you can make confident property decisions. Here's how we verify properties in 4 simple steps."}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border">
                  <ArrowRight className="absolute -right-2 -top-2 w-5 h-5 text-muted-foreground" />
                </div>
              )}

              {/* Card */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elevated transition-all duration-300 group-hover:-translate-y-1 h-full">
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    step.color === "primary" ? "bg-primary/10 text-primary" :
                    step.color === "secondary" ? "bg-secondary/20 text-secondary" :
                    "bg-success/10 text-success"
                  }`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="font-display text-4xl font-bold text-muted-foreground/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            <span className="text-primary font-medium">Average turnaround:</span> 2-5 business days depending on property type
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;