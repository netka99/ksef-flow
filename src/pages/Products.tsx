import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Search,
  Plus,
  Package,
  AlertTriangle,
  TrendingUp,
  Filter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  vatRate: number;
  sold30d: number;
}

const mockProducts: Product[] = [
  { id: "1", name: "Kartacze", category: "Dania główne", price: 7.0, unit: "szt.", stock: 20, vatRate: 8, sold30d: 234 },
  { id: "2", name: "Babka ziemniaczana", category: "Dania główne", price: 12.0, unit: "szt.", stock: 15, vatRate: 8, sold30d: 89 },
  { id: "3", name: "Kiszka ziemniaczana", category: "Dania główne", price: 8.5, unit: "szt.", stock: 4, vatRate: 8, sold30d: 145 },
  { id: "4", name: "Naleśniki z serem", category: "Dania główne", price: 14.0, unit: "szt.", stock: 0, vatRate: 8, sold30d: 67 },
  { id: "5", name: "Pizza Margherita", category: "Pizza", price: 28.0, unit: "szt.", stock: 10, vatRate: 8, sold30d: 156 },
  { id: "6", name: "Pierogi ruskie", category: "Dania główne", price: 18.0, unit: "12 szt.", stock: 30, vatRate: 8, sold30d: 189 },
  { id: "7", name: "Barszcz czerwony", category: "Zupy", price: 8.0, unit: "porcja", stock: 15, vatRate: 8, sold30d: 92 },
  { id: "8", name: "Żurek", category: "Zupy", price: 12.0, unit: "porcja", stock: 12, vatRate: 8, sold30d: 78 },
  { id: "9", name: "Coca-Cola 0.5L", category: "Napoje", price: 6.0, unit: "szt.", stock: 48, vatRate: 23, sold30d: 312 },
  { id: "10", name: "Sernik", category: "Desery", price: 10.0, unit: "kawałek", stock: 6, vatRate: 5, sold30d: 54 },
];

const categories = ["Wszystkie", "Dania główne", "Zupy", "Pizza", "Napoje", "Desery"];

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: "Brak", className: "bg-destructive/10 text-destructive" };
  if (stock <= 5) return { label: "Niski stan", className: "bg-warning/15 text-warning-foreground" };
  return { label: "Dostępny", className: "bg-success/10 text-success" };
};

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");

  const filtered = mockProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Wszystkie" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = mockProducts.length;
  const lowStock = mockProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = mockProducts.filter((p) => p.stock === 0).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
        <div className="px-5 pt-14 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-foreground">Produkty</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {totalProducts} pozycji w katalogu
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft"
            >
              <Plus className="w-5 h-5 text-primary-foreground" strokeWidth={2.25} />
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 p-3 rounded-xl bg-card shadow-soft">
              <div className="flex items-center gap-1.5 mb-1">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Razem</p>
              </div>
              <p className="text-lg font-semibold text-foreground">{totalProducts}</p>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-warning/10">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-warning-foreground" />
                <p className="text-[11px] font-semibold text-warning-foreground uppercase tracking-wide">Niski stan</p>
              </div>
              <p className="text-lg font-semibold text-warning-foreground">{lowStock}</p>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-destructive/10">
              <div className="flex items-center gap-1.5 mb-1">
                <X className="w-3.5 h-3.5 text-destructive" />
                <p className="text-[11px] font-semibold text-destructive uppercase tracking-wide">Brak</p>
              </div>
              <p className="text-lg font-semibold text-destructive">{outOfStock}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
            <input
              type="text"
              placeholder="Szukaj produktu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-card text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-soft"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground shadow-soft"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Products List */}
      <section className="px-5 py-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-[15px] text-muted-foreground">Brak produktów</p>
          </div>
        ) : (
          filtered.map((product, index) => {
            const status = getStockStatus(product.stock);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileTap={{ scale: 0.99 }}
                className="bg-card rounded-2xl p-4 shadow-soft cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Image placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-semibold text-accent-foreground">
                      {product.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-medium text-foreground truncate">
                          {product.name}
                        </h4>
                        <p className="text-[13px] text-muted-foreground">
                          {product.category} · VAT {product.vatRate}%
                        </p>
                      </div>
                      <p className="text-[15px] font-semibold text-foreground whitespace-nowrap">
                        {product.price.toFixed(2)} zł
                      </p>
                    </div>

                    {/* Status row */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          {product.stock} {product.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                        <TrendingUp className="w-3 h-3" />
                        <span>{product.sold30d}/mc</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default Products;
