import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, RotateCcw, Percent, Tag } from "lucide-react";
import { NumPad } from "./NumPad";
import { useState, useEffect } from "react";

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
  onConfirm: (quantity: number, isReturn?: boolean, discount?: { type: 'percent' | 'fixed'; value: number }) => void;
}

export function ProductDetailSheet({ 
  isOpen, 
  onClose, 
  product, 
  onConfirm 
}: ProductDetailSheetProps) {
  const [quantity, setQuantity] = useState("1");
  const [isReturn, setIsReturn] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuantity("1");
      setIsReturn(false);
      setShowDiscount(false);
      setDiscountValue("");
    }
  }, [isOpen]);

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
      const discount = discountValue ? { type: discountType, value: parseFloat(discountValue) || 0 } : undefined;
      onConfirm(qty, isReturn, discount);
      setQuantity("1");
      onClose();
    }
  };

  const baseTotal = product ? product.price * (parseFloat(quantity) || 0) : 0;
  const discountAmount = discountValue 
    ? discountType === 'percent' 
      ? baseTotal * (parseFloat(discountValue) / 100) 
      : parseFloat(discountValue) || 0
    : 0;
  const total = Math.max(0, baseTotal - discountAmount);

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
            className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-[60]"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-3xl shadow-floating max-h-[90vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div className="flex-1">
                <h3 className="text-foreground font-medium">{product.name}</h3>
                <p className="text-[13px] text-muted-foreground">
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

            {/* Sale/Return Toggle & Discount */}
            <div className="flex items-center gap-2 px-5 pb-4">
              {/* Sale/Return Toggle */}
              <div className="flex bg-secondary rounded-xl p-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsReturn(false)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    !isReturn 
                      ? "bg-card text-foreground shadow-sm" 
                      : "text-muted-foreground"
                  }`}
                >
                  Sprzedaż
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsReturn(true)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                    isReturn 
                      ? "bg-card text-orange-600 shadow-sm" 
                      : "text-muted-foreground"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Zwrot
                </motion.button>
              </div>

              {/* Discount Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDiscount(!showDiscount)}
                className={`ml-auto px-3 py-2 rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                  showDiscount || discountValue 
                    ? "bg-primary/10 text-primary" 
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                Rabat
              </motion.button>
            </div>

            {/* Discount Panel */}
            <AnimatePresence>
              {showDiscount && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 flex items-center gap-3">
                    {/* Discount Type Toggle */}
                    <div className="flex bg-secondary rounded-lg p-0.5">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDiscountType('percent')}
                        className={`w-10 h-9 rounded-md flex items-center justify-center transition-all ${
                          discountType === 'percent' 
                            ? "bg-card text-foreground shadow-sm" 
                            : "text-muted-foreground"
                        }`}
                      >
                        <Percent className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDiscountType('fixed')}
                        className={`w-10 h-9 rounded-md flex items-center justify-center text-[13px] font-medium transition-all ${
                          discountType === 'fixed' 
                            ? "bg-card text-foreground shadow-sm" 
                            : "text-muted-foreground"
                        }`}
                      >
                        zł
                      </motion.button>
                    </div>

                    {/* Discount Input */}
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder={discountType === 'percent' ? "0" : "0.00"}
                        className="w-full h-10 px-4 pr-10 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-right text-[15px] font-medium"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[13px]">
                        {discountType === 'percent' ? '%' : 'zł'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quantity Display */}
            <div className="px-5 py-5 border-t border-border">
              <div className="flex items-center justify-center gap-10">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrement}
                  className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center"
                >
                  <Minus className="w-6 h-6 text-secondary-foreground" />
                </motion.button>
                
                <div className="text-center min-w-[80px]">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                    Ilość
                  </p>
                  <p className="text-5xl font-semibold text-foreground tabular-nums">
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

            {/* NumPad */}
            <NumPad
              onNumber={handleNumber}
              onDelete={handleDelete}
              showConfirm={false}
            />

            {/* Total & Confirm */}
            <div className="px-5 pb-12 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[15px] text-muted-foreground">Suma</span>
                <div className="text-right">
                  {discountAmount > 0 && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      {baseTotal.toFixed(2)} zł
                    </span>
                  )}
                  <span className={`text-2xl font-semibold ${isReturn ? "text-orange-600" : "text-foreground"}`}>
                    {isReturn ? "-" : ""}{total.toFixed(2)} zł
                  </span>
                </div>
              </div>
              {discountAmount > 0 && (
                <p className="text-[13px] text-primary text-right mb-3">
                  Rabat: -{discountAmount.toFixed(2)} zł
                </p>
              )}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className={`w-full py-4 rounded-xl font-semibold text-[17px] ${
                  isReturn 
                    ? "bg-orange-500 text-white" 
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {isReturn ? "Dodaj zwrot" : "Dodaj do zamówienia"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
