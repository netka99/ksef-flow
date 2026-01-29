import { motion } from "framer-motion";
import { ChevronLeft, Download, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { InvoiceStatusPill } from "@/components/KSeFStatusCard";

const mockInvoices = [
  { id: "FV/2024/001", customer: "Jan Kowalski Sp. z o.o.", amount: 1234.56, date: "2024-01-28", status: "sent" as const, ksef_id: "1234567890" },
  { id: "FV/2024/002", customer: "ABC Company", amount: 2456.78, date: "2024-01-28", status: "pending" as const },
  { id: "FV/2024/003", customer: "XYZ Trading", amount: 890.00, date: "2024-01-27", status: "sent" as const, ksef_id: "1234567891" },
  { id: "FV/2024/004", customer: "Firma Testowa", amount: 3456.00, date: "2024-01-27", status: "error" as const },
  { id: "FV/2024/005", customer: "Handel Plus", amount: 567.89, date: "2024-01-26", status: "sent" as const, ksef_id: "1234567892" },
];

const Invoices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 pt-12 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <h1 className="flex-1 text-lg font-semibold text-foreground">Faktury</h1>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
            >
              <Filter className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Szukaj faktury lub klienta..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 px-4 pb-4">
          <div className="flex-1 p-3 rounded-xl bg-success/10 text-center">
            <p className="text-xs text-muted-foreground">Wysłane</p>
            <p className="text-lg font-bold text-success">45</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-warning/10 text-center">
            <p className="text-xs text-muted-foreground">Oczekuje</p>
            <p className="text-lg font-bold text-warning-foreground">3</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-destructive/10 text-center">
            <p className="text-xs text-muted-foreground">Błędy</p>
            <p className="text-lg font-bold text-destructive">1</p>
          </div>
        </div>
      </header>

      {/* Invoice List */}
      <section className="px-4 py-4 space-y-3">
        {mockInvoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card rounded-2xl p-4 shadow-soft cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{invoice.id}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer}</p>
              </div>
              <InvoiceStatusPill status={invoice.status} ksef_id={invoice.ksef_id} />
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{invoice.date}</p>
              <div className="flex items-center gap-3">
                <p className="font-bold text-foreground">{invoice.amount.toFixed(2)} zł</p>
                {invoice.status === "sent" && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 text-secondary-foreground" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <BottomNav />
    </div>
  );
};

export default Invoices;
