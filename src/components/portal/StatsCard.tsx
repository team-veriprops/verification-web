import { LucideIcon } from "lucide-react";
import { cn } from "@lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "timeless";
  className?: string;
  onClick?: () => void
}

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  variant = "default",
  className,
  onClick
}: StatsCardProps) => {
  const variantStyles = {
    default: "bg-card",
    primary: "bg-primary/5 border-primary/20",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    danger: "bg-danger/5 border-danger/20",
    timeless: "bg-purple-500/5"
  };

  const iconStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    timeless: "bg-purple-500/10 text-purple-500"
  };

  return (
    <div className={cn(
      "rounded-xl border border-border p-4 lg:p-5 transition-shadow hover:shadow-soft",
      variantStyles[variant],
      className
    )}
    onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            {value}
          </p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-danger"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center",
          iconStyles[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
