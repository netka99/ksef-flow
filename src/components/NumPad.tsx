import { motion } from "framer-motion";
import { Delete } from "lucide-react";

interface NumPadProps {
  onNumber: (num: string) => void;
  onDelete: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  showConfirm?: boolean;
}

export function NumPad({ 
  onNumber, 
  onDelete, 
  onConfirm, 
  confirmLabel = "OK",
  showConfirm = true 
}: NumPadProps) {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "delete"],
  ];

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      onDelete();
    } else {
      onNumber(key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {keys.flat().map((key, index) => (
        <motion.button
          key={index}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleKeyPress(key)}
          className="numpad-btn h-14"
        >
          {key === "delete" ? (
            <Delete className="w-6 h-6" />
          ) : (
            key
          )}
        </motion.button>
      ))}
      
      {showConfirm && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="numpad-btn-action col-span-3 h-14 mt-2"
        >
          {confirmLabel}
        </motion.button>
      )}
    </div>
  );
}
