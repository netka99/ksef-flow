import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Wifi, WifiOff, RefreshCw, FileText, CheckCircle2, Clock, AlertCircle, Send, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

type ConnectionStatus = "connected" | "disconnected" | "syncing";

interface Invoice {
  id: string;
  number: string;
  buyer: string;
  amount: number;
  date: string;
  ksefStatus: "sent" | "pending" | "error";
  ksefId?: string;
}

const mockInvoices: Invoice[] = [
  { id: "1", number: "FV/2026/02/001", buyer: "Jan Kowalski", amount: 145.50, date: "2026-02-06", ksefStatus: "sent", ksefId: "KSeF-2026-00421" },
  { id: "2", number: "FV/2026/02/002", buyer: "Anna Nowak", amount: 89.00, date: "2026-02-06", ksefStatus: "sent", ksefId: "KSeF-2026-00422" },
  { id: "3", number: "FV/2026/02/003", buyer: "Firma XYZ Sp. z o.o.", amount: 320.00, date: "2026-02-06", ksefStatus: "pending" },
  { id: "4", number: "FV/2026/02/004", buyer: "Marek Wiśniewski", amount: 56.00, date: "2026-02-05", ksefStatus: "error" },
  { id: "5", number: "FV/2026/02/005", buyer: "Sklep ABC", amount: 1240.00, date: "2026-02-05", ksefStatus: "pending" },
];

const KSeF = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ConnectionStatus>("connected");
  const [filter, setFilter] = useState<"all" | "sent" | "pending" | "error">("all");

  const filtered = filter === "all" ? mockInvoices : mockInvoices.filter((i) => i.ksefStatus === filter);
  const pendingCount = mockInvoices.filter((i) => i.ksefStatus === "pending").length;
  const errorCount = mockInvoices.filter((i) => i.ksefStatus === "error").length;

  const statusConfig = {
    connected: { icon: Wifi, label: "Połączono z KSeF", sub: "Sesja aktywna", dotClass: "status-dot-success", bg: "bg-success/5" },
    disconnected: { icon: WifiOff, label: "Rozłączono", sub: "Tryb offline", dotClass: "status-dot-error", bg: "bg-destructive/5" },
    syncing: { icon: RefreshCw, label: "Synchronizacja...", sub: `${pendingCount} w kolejce`, dotClass: "status-dot-warning", bg: "bg-warning/5" },
  };

  const cfg = statusConfig[status];
  const StatusIcon = cfg.icon;

  const getStatusIcon = (s: Invoice["ksefStatus"]) => {
    if (s === "sent") return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (s === "pending") return <Clock className="w-4 h-4 text-warning" />;
    return <AlertCircle className="w-4 h-4 text-destructive" />;
  };

  const getStatusLabel = (s: Invoice["ksefStatus"]) => {
    if (s === "sent") return "Wysłano";
    if (s === "pending") return "Oczekuje";
    return "Błąd";
  };

  const filters: { key: typeof filter; label: string; count?: number }[] = [
    { key: "all", label: "Wszystkie" },
    { key: "pending", label: "Oczekujące", count: pendingCount },
    { key: "error", label: "Błędy", count: errorCount },
    { key: "sent", label: "Wysłane" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-foreground">KSeF</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Krajowy System e-Faktur
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl ${cfg.bg}`}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-card shadow-soft flex items-center justify-center">
              <StatusIcon className={`w-6 h-6 text-foreground ${status === "syncing" ? "animate-spin" : ""}`} strokeWidth={1.5} />
            </div>
            <div className={`absolute -top-1 -right-1 ${cfg.dotClass}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{cfg.label}</p>
            <p className="text-sm text-muted-foreground">{cfg.sub}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setStatus(status === "connected" ? "disconnected" : "connected")}
            className="px-4 py-2 rounded-xl bg-card shadow-soft text-[13px] font-medium text-foreground"
          >
            {status === "connected" ? "Rozłącz" : "Połącz"}
          </motion.button>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatus("syncing")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-[14px]"
          >
            <Send className="w-4 h-4" />
            Wyślij oczekujące ({pendingCount})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-card shadow-soft text-foreground font-medium text-[14px]"
          >
            <RefreshCw className="w-4 h-4" />
            Sync
          </motion.button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-4">
        {filters.map((f) => (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            {f.label}
            {f.count !== undefined && f.count > 0 && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                filter === f.key ? "bg-primary-foreground/20" : "bg-destructive/10 text-destructive"
              }`}>
                {f.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Invoice List */}
      <section className="px-5 space-y-3">
        {filtered.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-card rounded-2xl p-4 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[15px] font-medium text-foreground truncate">{invoice.number}</h4>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    invoice.ksefStatus === "sent" ? "bg-success/10 text-success" :
                    invoice.ksefStatus === "pending" ? "bg-warning/15 text-warning-foreground" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    {getStatusIcon(invoice.ksefStatus)}
                    {getStatusLabel(invoice.ksefStatus)}
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5">{invoice.buyer}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[13px] text-muted-foreground">{invoice.date}</span>
                  {invoice.ksefId && (
                    <span className="text-[11px] text-primary font-mono">{invoice.ksefId}</span>
                  )}
                </div>
              </div>
              <p className="text-[15px] font-semibold text-foreground flex-shrink-0">
                {invoice.amount.toFixed(2)} zł
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      <BottomNav />
    </div>
  );
};

export default KSeF;
