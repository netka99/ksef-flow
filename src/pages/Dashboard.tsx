import { motion } from "framer-motion";
import { Bell, Store, TrendingUp, Receipt, Package, Users, FileSpreadsheet, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavGridItem } from "@/components/NavGridItem";
import { StatusCard } from "@/components/StatusCard";
import { KSeFStatusCard } from "@/components/KSeFStatusCard";
import { BottomNav } from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  
  const greeting = currentHour < 12 
    ? "Dzień dobry" 
    : currentHour < 18 
      ? "Miłego popołudnia" 
      : "Dobry wieczór";

  const navItems = [
    { icon: TrendingUp, label: "Sprzedaż", path: "/sales", variant: "primary" as const },
    { icon: Users, label: "Klienci", path: "/clients" },
    { icon: Receipt, label: "Analityka", path: "/reports" },
    { icon: Package, label: "Produkty", path: "/products" },
    { icon: FileSpreadsheet, label: "KSeF", path: "/ksef" },
    { icon: Settings, label: "Ustawienia", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-muted-foreground text-sm"
            >
              {greeting}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-foreground"
            >
              Witaj Anna
            </motion.h1>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft"
            >
              <Store className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>

        {/* KSeF Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <KSeFStatusCard 
            status="connected" 
            lastSync="12:45"
            onClick={() => navigate("/ksef")}
          />
        </motion.div>
      </header>

      {/* Status Cards */}
      <section className="px-6 mb-8">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          <StatusCard
            title="Dziś"
            value="4 582,00 zł"
            trend={{ value: 12, label: "vs wczoraj" }}
            status="success"
          />
          <StatusCard
            title="Faktur"
            value="23"
            subtitle="w tym miesiącu"
          />
          <StatusCard
            title="Oczekuje"
            value="3"
            subtitle="do wysłania"
            status="warning"
          />
        </div>
      </section>

      {/* Navigation Grid */}
      <section className="px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <NavGridItem
                icon={item.icon}
                label={item.label}
                variant={item.variant}
                onClick={() => navigate(item.path)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
