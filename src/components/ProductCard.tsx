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
      whileTap={{ scale: 0.99 }}
      className="flex items-center gap-4 p-3.5 bg-card rounded-xl shadow-soft cursor-pointer"
    >
      {/* Product Image */}
      <div className="w-14 h-14 rounded-xl bg-accent overflow-hidden flex-shrink-0 flex items-center justify-center">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-semibold text-accent-foreground">
            {name.charAt(0)}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-medium text-foreground truncate">{name}</h4>
        <p className="text-[13px] text-muted-foreground">
          {price.toFixed(2)} zł / {unit}
        </p>
        {stock !== undefined && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Stan: {stock}
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
          <span className="w-6 text-center text-[15px] font-semibold text-foreground">{quantity}</span>
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
          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center"
        >
          <Plus className="w-[18px] h-[18px] text-primary-foreground" />
        </motion.button>
      )}
    </motion.div>
  );
}
