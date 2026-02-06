import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface SaleDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function SaleDatePicker({ date, onDateChange }: SaleDatePickerProps) {
  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all",
            isToday
              ? "bg-secondary text-foreground"
              : "bg-primary/10 text-primary"
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          {isToday ? "Dziś" : format(date, "d MMM", { locale: pl })}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && onDateChange(d)}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
