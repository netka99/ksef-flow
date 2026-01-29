import { motion } from "framer-motion";
import { ChevronRight, Wifi, WifiOff, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface KSeFStatusCardProps {
  status: "connected" | "disconnected" | "syncing";
  lastSync?: string;
  pendingCount?: number;
  onClick?: () => void;
}

export function KSeFStatusCard({ 
  status, 
  lastSync, 
  pendingCount = 0,
  onClick 
}: KSeFStatusCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          label: "Połączono z KSeF",
          sublabel: lastSync ? `Ostatnia sync: ${lastSync}` : "Gotowy do wysyłania",
          dotClass: "status-dot-success",
          bgClass: "bg-success/5",
        };
      case "disconnected":
        return {
          icon: WifiOff,
          label: "Brak połączenia",
          sublabel: "Tryb offline aktywny",
          dotClass: "status-dot-error",
          bgClass: "bg-destructive/5",
        };
      case "syncing":
        return {
          icon: Clock,
          label: "Synchronizacja...",
          sublabel: `${pendingCount} faktur w kolejce`,
          dotClass: "status-dot-warning",
          bgClass: "bg-warning/5",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl ${config.bgClass} transition-colors`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-card shadow-soft flex items-center justify-center">
          <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
        </div>
        <div className={`absolute -top-1 -right-1 ${config.dotClass}`} />
      </div>

      <div className="flex-1 text-left">
        <p className="font-medium text-foreground">{config.label}</p>
        <p className="text-sm text-muted-foreground">{config.sublabel}</p>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </motion.button>
  );
}

interface InvoiceStatusPillProps {
  status: "sent" | "pending" | "error";
  ksef_id?: string;
}

export function InvoiceStatusPill({ status, ksef_id }: InvoiceStatusPillProps) {
  const getConfig = () => {
    switch (status) {
      case "sent":
        return {
          icon: CheckCircle2,
          label: ksef_id || "Wysłano",
          className: "status-pill-success",
        };
      case "pending":
        return {
          icon: Clock,
          label: "Oczekuje",
          className: "status-pill-warning",
        };
      case "error":
        return {
          icon: AlertCircle,
          label: "Błąd",
          className: "status-pill-error",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
