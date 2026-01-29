import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  status?: "success" | "warning" | "error";
  icon?: React.ReactNode;
}

export function StatusCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  status,
  icon 
}: StatusCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-3.5 h-3.5" />;
    if (trend.value < 0) return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.value > 0) return "text-success";
    if (trend.value < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 shadow-soft min-w-[160px] flex-shrink-0"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        {status && (
          <div className={`status-dot-${status}`} />
        )}
        {icon && !status && (
          <div className="text-muted-foreground">{icon}</div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        
        {(subtitle || trend) && (
          <div className="flex items-center gap-2">
            {trend && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                {Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
