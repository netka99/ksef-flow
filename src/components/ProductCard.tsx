import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock?: number;
  image?: string;
  onAdd?: () => void;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export function ProductCard({
  name,
  price,
  unit,
  stock,
  image,
  onAdd,
  quantity = 0,
  onQuantityChange,
}: ProductCardProps) {
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuantityChange) {
      onQuantityChange(quantity + 1);
    } else if (onAdd) {
      onAdd();
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuantityChange && quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft cursor-pointer"
    >
      {/* Product Image */}
      <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent to-muted flex items-center justify-center">
            <span className="text-2xl">{name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{name}</h4>
        <p className="text-sm text-muted-foreground">
          {price.toFixed(2)} zł / {unit}
        </p>
        {stock !== undefined && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {stock} szt.
          </p>
        )}
      </div>

      {/* Quantity Controls or Add Button */}
      {quantity > 0 ? (
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrement}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          >
            <Minus className="w-4 h-4 text-secondary-foreground" />
          </motion.button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrement}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-primary-foreground" />
          </motion.button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </motion.button>
      )}
    </motion.div>
  );
}
