import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Search, ScanLine, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSheet } from "@/components/ProductDetailSheet";
import { BottomNav } from "@/components/BottomNav";

interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image?: string;
}

const mockProducts = [
  { id: "1", name: "Kartacze", price: 7.00, unit: "szt.", stock: 20, image: "" },
  { id: "2", name: "Babka ziemniaczana", price: 12.00, unit: "szt.", stock: 15, image: "" },
  { id: "3", name: "Kiszka", price: 8.50, unit: "szt.", stock: 20, image: "" },
  { id: "4", name: "Naleśniki", price: 7.00, unit: "szt.", stock: 25, image: "" },
  { id: "5", name: "Pizza Margherita", price: 28.00, unit: "szt.", stock: 10, image: "" },
  { id: "6", name: "Pierogi ruskie", price: 15.00, unit: "szt.", stock: 30, image: "" },
];

const categories = ["Wszystkie", "Dania główne", "Napoje", "Desery", "Pieczywo"];

const Sales = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProductTap = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleAddToCart = (quantity: number) => {
    if (!selectedProduct) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === selectedProduct.id);
      if (existing) {
        return prev.map(item => 
          item.id === selectedProduct.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...selectedProduct, quantity }];
    });
  };

  const handleQuickAdd = (product: typeof mockProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getProductQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-background pb-36">
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
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Dostawa Sklep ABC</h1>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
            >
              <ScanLine className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Szukaj produktu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-12 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-secondary flex items-center justify-center"
            >
              <Filter className="w-4 h-4 text-secondary-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Products Header */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold text-foreground">Produkty</h2>
      </div>

      {/* Products List */}
      <section className="px-4 space-y-3">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleProductTap(product)}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              unit={product.unit}
              stock={product.stock}
              quantity={getProductQuantity(product.id)}
              onAdd={() => handleQuickAdd(product)}
            />
          </motion.div>
        ))}
      </section>

      {/* Cart Summary */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-4 right-4 z-40"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/checkout")}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary text-primary-foreground shadow-elevated"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
                {cartCount}
              </span>
              <span className="font-medium">Do zamówienia</span>
            </div>
            <span className="text-lg font-bold">{cartTotal.toFixed(2)} zł</span>
          </motion.button>
        </motion.div>
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        product={selectedProduct}
        onConfirm={handleAddToCart}
      />

      <BottomNav />
    </div>
  );
};

export default Sales;
