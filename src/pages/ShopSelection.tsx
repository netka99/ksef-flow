import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Clock, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockShops = [
  { 
    id: "1", 
    name: "Sklep ABC Centrum", 
    address: "ul. Główna 15, Białystok",
    isOpen: true,
    todayRevenue: 2340.50,
    activeDevices: 2
  },
  { 
    id: "2", 
    name: "Sklep ABC Galeria", 
    address: "ul. Handlowa 8, Białystok",
    isOpen: true,
    todayRevenue: 1890.00,
    activeDevices: 1
  },
  { 
    id: "3", 
    name: "Sklep ABC Rynek", 
    address: "Rynek Kościuszki 5, Białystok",
    isOpen: false,
    todayRevenue: 0,
    activeDevices: 0
  },
];

const ShopSelection = () => {
  const navigate = useNavigate();

  const handleShopSelect = (shopId: string) => {
    navigate(`/sales/${shopId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-5 pt-14 pb-6">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-foreground">Wybierz sklep</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Wybierz lokalizację do sprzedaży
            </p>
          </div>
        </div>
      </header>

      {/* Shops List */}
      <section className="px-5 space-y-3">
        {mockShops.map((shop, index) => (
          <motion.button
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShopSelect(shop.id)}
            className="w-full bg-card rounded-2xl p-4 shadow-soft text-left"
          >
            <div className="flex items-start gap-4">
              {/* Shop Icon */}
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent-foreground" />
              </div>

              {/* Shop Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-foreground truncate">{shop.name}</h3>
                  {shop.isOpen ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Otwarte
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Zamknięte
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground mb-3">{shop.address}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Dziś</p>
                    <p className="text-[15px] font-semibold text-foreground">
                      {shop.todayRevenue.toFixed(2)} zł
                    </p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Urządzenia</p>
                    <p className="text-[15px] font-semibold text-foreground">{shop.activeDevices}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
            </div>
          </motion.button>
        ))}

        {/* Add Shop Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Dodaj sklep</span>
        </motion.button>
      </section>
    </div>
  );
};

export default ShopSelection;
