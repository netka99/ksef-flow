import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { NumPad } from "./NumPad";
import { useState } from "react";

interface ProductDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    image?: string;
  } | null;
  onConfirm: (quantity: number) => void;
}

export function ProductDetailSheet({ 
  isOpen, 
  onClose, 
  product, 
  onConfirm 
}: ProductDetailSheetProps) {
  const [quantity, setQuantity] = useState("1");

  const handleNumber = (num: string) => {
    if (quantity === "0" && num !== ".") {
      setQuantity(num);
    } else if (num === "." && quantity.includes(".")) {
      return;
    } else {
      setQuantity(quantity + num);
    }
  };

  const handleDelete = () => {
    if (quantity.length > 1) {
      setQuantity(quantity.slice(0, -1));
    } else {
      setQuantity("0");
    }
  };

  const handleIncrement = () => {
    const num = parseFloat(quantity) || 0;
    setQuantity(String(num + 1));
  };

  const handleDecrement = () => {
    const num = parseFloat(quantity) || 0;
    if (num > 0) {
      setQuantity(String(Math.max(0, num - 1)));
    }
  };

  const handleConfirm = () => {
    const qty = parseFloat(quantity) || 0;
    if (qty > 0) {
      onConfirm(qty);
      setQuantity("1");
      onClose();
    }
  };

  const total = product ? product.price * (parseFloat(quantity) || 0) : 0;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-floating max-h-[90vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <p className="text-xs text-muted-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.price.toFixed(2)} zł / {product.unit}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4 text-secondary-foreground" />
              </motion.button>
            </div>

            {/* Quantity Display */}
            <div className="px-6 py-6 border-t border-b border-border">
              <div className="flex items-center justify-center gap-8">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrement}
                  className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center"
                >
                  <Minus className="w-6 h-6 text-secondary-foreground" />
                </motion.button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Ilość
                  </p>
                  <p className="text-5xl font-bold text-foreground tabular-nums">
                    {quantity}
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleIncrement}
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center"
                >
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 px-6 py-4">
              <button className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium">
                Zwrot
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium">
                Rabat
              </button>
            </div>

            {/* NumPad */}
            <NumPad
              onNumber={handleNumber}
              onDelete={handleDelete}
              showConfirm={false}
            />

            {/* Total & Confirm */}
            <div className="px-6 pb-8 pt-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Suma</span>
                <span className="text-2xl font-bold text-foreground">
                  {total.toFixed(2)} zł
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-soft"
              >
                Dodaj do zamówienia
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
