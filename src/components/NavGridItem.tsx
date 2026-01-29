import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface NavGridItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  badge?: number;
  variant?: "default" | "primary";
}

export function NavGridItem({ 
  icon: Icon, 
  label, 
  onClick, 
  badge,
  variant = "default" 
}: NavGridItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="nav-grid-item relative"
    >
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-3 right-3 min-w-[20px] h-5 px-1.5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
        variant === "primary" 
          ? "bg-primary text-primary-foreground" 
          : "bg-accent text-accent-foreground"
      }`}>
        <Icon className="w-7 h-7" strokeWidth={1.5} />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </motion.button>
  );
}
