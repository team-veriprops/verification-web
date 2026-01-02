import { ShieldCheck, FileCheck, MapPin, CheckCircle, Award } from "lucide-react";
import { trustBadges } from "@data/mockData";

const iconMap: Record<string, React.ReactNode> = {
  "shield-check": <ShieldCheck className="w-6 h-6" />,
  "file-check": <FileCheck className="w-6 h-6" />,
  "map-pin": <MapPin className="w-6 h-6" />,
  "check-circle": <CheckCircle className="w-6 h-6" />,
  "award": <Award className="w-6 h-6" />,
};

const TrustBadges = () => {
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-16">
          {trustBadges.map((badge, index) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 text-primary-foreground opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <div className="text-primary-foreground/80">
                {iconMap[badge.icon]}
              </div>
              <span className="font-medium text-sm md:text-base whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;