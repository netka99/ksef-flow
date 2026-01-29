import { motion } from "framer-motion";
import { ChevronLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { StatusCard } from "@/components/StatusCard";

const Reports = () => {
  const navigate = useNavigate();

  // Mock data for chart
  const chartData = [
    { day: "Pon", value: 2400 },
    { day: "Wt", value: 3200 },
    { day: "Śr", value: 2800 },
    { day: "Czw", value: 4100 },
    { day: "Pt", value: 3800 },
    { day: "Sob", value: 5200 },
    { day: "Ndz", value: 2100 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <h1 className="flex-1 text-lg font-semibold text-foreground">Raporty</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft"
          >
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Ten tydzień</span>
          </motion.button>
        </div>

        {/* Main Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 shadow-soft mb-6"
        >
          <p className="text-sm text-muted-foreground mb-1">Przychód w tym tygodniu</p>
          <div className="flex items-end gap-3 mb-4">
            <h2 className="text-4xl font-bold text-foreground">23 600,00</h2>
            <span className="text-lg text-muted-foreground mb-1">zł</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm font-medium text-success">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
            <span className="text-sm text-muted-foreground">vs poprzedni tydzień</span>
          </div>
        </motion.div>

        {/* Mini Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-soft"
        >
          <div className="flex items-end justify-between h-32 gap-2 mb-3">
            {chartData.map((item, index) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / maxValue) * 100}%` }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                  className="w-full rounded-lg bg-primary/20"
                  style={{ minHeight: 8 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {chartData.map((item) => (
              <span key={item.day} className="text-xs text-muted-foreground text-center flex-1">
                {item.day}
              </span>
            ))}
          </div>
        </motion.div>
      </header>

      {/* Stats Cards */}
      <section className="px-4 mb-6">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          <StatusCard
            title="Transakcje"
            value="156"
            trend={{ value: 8, label: "vs tydzień" }}
          />
          <StatusCard
            title="Śr. koszyk"
            value="151,28 zł"
            trend={{ value: -3, label: "vs tydzień" }}
          />
          <StatusCard
            title="VAT należny"
            value="4 428,00 zł"
            subtitle="do 25.02"
          />
        </div>
      </section>

      {/* Top Products */}
      <section className="px-4">
        <h3 className="font-semibold text-foreground mb-4">Najpopularniejsze produkty</h3>
        <div className="space-y-3">
          {[
            { name: "Kartacze", sales: 234, revenue: 1638 },
            { name: "Pierogi ruskie", sales: 189, revenue: 2835 },
            { name: "Pizza Margherita", sales: 156, revenue: 4368 },
            { name: "Naleśniki", sales: 145, revenue: 1015 },
          ].map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft"
            >
              <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} sprzedanych</p>
              </div>
              <p className="font-bold text-foreground">{product.revenue.toFixed(2)} zł</p>
            </motion.div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Reports;
