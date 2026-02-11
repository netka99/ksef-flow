import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, Banknote, Smartphone, Trash2, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  isReturn?: boolean;
  discount?: { type: "percent" | "fixed"; value: number };
}

// Mock cart data - in real app this would come from state/context
const mockCart: CartItem[] = [
  { id: "1", name: "Kartacze", price: 7.0, unit: "szt.", quantity: 3 },
  { id: "2", name: "Babka ziemniaczana", price: 12.0, unit: "szt.", quantity: 2 },
  { id: "6", name: "Pierogi ruskie", price: 15.0, unit: "szt.", quantity: 1, discount: { type: "percent", value: 10 } },
];

const paymentMethods = [
  { id: "cash", icon: Banknote, label: "Gotówka" },
  { id: "card", icon: CreditCard, label: "Karta" },
  { id: "blik", icon: Smartphone, label: "BLIK" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(mockCart);
  const [selectedPayment, setSelectedPayment] = useState("cash");

  const getItemTotal = (item: CartItem) => {
    const base = item.price * item.quantity;
    if (!item.discount) return base;
    if (item.discount.type === "percent") return base * (1 - item.discount.value / 100);
    return Math.max(0, base - item.discount.value);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + getItemTotal(item), 0);
  const totalDiscount = subtotal - total;

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirm = () => {
    navigate("/post-sale");
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 pt-14 pb-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-foreground">Zamówienie</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {cart.length} {cart.length === 1 ? "pozycja" : "pozycji"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <section className="px-5 py-4 space-y-3">
        {cart.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl p-4 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-base font-semibold text-accent-foreground">
                  {item.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-medium text-foreground truncate">{item.name}</h4>
                <p className="text-[13px] text-muted-foreground">
                  {item.price.toFixed(2)} zł / {item.unit}
                </p>
                {item.discount && (
                  <p className="text-[12px] text-primary mt-0.5">
                    Rabat: {item.discount.type === "percent" ? `${item.discount.value}%` : `${item.discount.value.toFixed(2)} zł`}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[15px] font-semibold text-foreground">
                  {getItemTotal(item).toFixed(2)} zł
                </p>
                {item.discount && (
                  <p className="text-[12px] text-muted-foreground line-through">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </p>
                )}
              </div>
            </div>

            {/* Quantity + Remove */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </motion.button>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <Minus className="w-4 h-4 text-secondary-foreground" />
                </motion.button>
                <span className="w-8 text-center text-[15px] font-semibold text-foreground tabular-nums">
                  {item.quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-primary-foreground" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Payment Method */}
      <section className="px-5 py-2">
        <h3 className="text-foreground mb-3">Metoda płatności</h3>
        <div className="flex gap-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isActive = selectedPayment === method.id;
            return (
              <motion.button
                key={method.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl transition-all ${
                  isActive
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-card border-2 border-transparent shadow-soft"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[13px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {method.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Summary & Confirm */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-24 left-0 right-0 z-40 px-5"
      >
        <div className="bg-card rounded-2xl shadow-floating p-5">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[14px]">
              <span className="text-muted-foreground">Suma pozycji</span>
              <span className="text-foreground">{subtotal.toFixed(2)} zł</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-[14px]">
                <span className="text-primary">Rabaty</span>
                <span className="text-primary">-{totalDiscount.toFixed(2)} zł</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-[17px] font-semibold text-foreground">Do zapłaty</span>
              <span className="text-[22px] font-bold text-foreground">{total.toFixed(2)} zł</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-[17px]"
          >
            Zapisz
          </motion.button>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Checkout;
