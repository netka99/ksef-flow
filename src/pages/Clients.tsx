import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Search,
  Plus,
  Users,
  Building2,
  User,
  Phone,
  Star,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

interface Client {
  id: string;
  name: string;
  type: "company" | "individual";
  nip?: string;
  phone?: string;
  city: string;
  totalRevenue: number;
  invoiceCount: number;
  lastPurchase: string;
  isFavorite?: boolean;
}

const mockClients: Client[] = [
  { id: "1", name: "ABC Trading Sp. z o.o.", type: "company", nip: "5252344566", phone: "+48 600 100 200", city: "Warszawa", totalRevenue: 24580, invoiceCount: 23, lastPurchase: "2 dni temu", isFavorite: true },
  { id: "2", name: "Anna Kowalska", type: "individual", phone: "+48 600 200 300", city: "Białystok", totalRevenue: 1240, invoiceCount: 8, lastPurchase: "wczoraj" },
  { id: "3", name: "Bistro Smak", type: "company", nip: "5421234567", city: "Kraków", totalRevenue: 18900, invoiceCount: 14, lastPurchase: "3 dni temu", isFavorite: true },
  { id: "4", name: "Cafe Central", type: "company", nip: "1234567890", phone: "+48 700 100 200", city: "Warszawa", totalRevenue: 8540, invoiceCount: 11, lastPurchase: "tydzień temu" },
  { id: "5", name: "Jan Nowak", type: "individual", city: "Białystok", totalRevenue: 480, invoiceCount: 3, lastPurchase: "2 tyg. temu" },
  { id: "6", name: "Marek Wiśniewski", type: "individual", phone: "+48 660 500 100", city: "Gdańsk", totalRevenue: 1850, invoiceCount: 6, lastPurchase: "5 dni temu" },
  { id: "7", name: "Restauracja Polska", type: "company", nip: "9876543210", city: "Białystok", totalRevenue: 32100, invoiceCount: 28, lastPurchase: "dziś", isFavorite: true },
  { id: "8", name: "Sklep XYZ", type: "company", nip: "5556677889", phone: "+48 500 100 100", city: "Kraków", totalRevenue: 6200, invoiceCount: 9, lastPurchase: "tydzień temu" },
];

const Clients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "company" | "individual">("all");

  const filtered = mockClients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nip?.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "favorites") return c.isFavorite;
    if (filter === "company") return c.type === "company";
    if (filter === "individual") return c.type === "individual";
    return true;
  });

  // Group alphabetically
  const grouped = useMemo(() => {
    const groups: Record<string, Client[]> = {};
    filtered
      .sort((a, b) => a.name.localeCompare(b.name, "pl"))
      .forEach((c) => {
        const letter = c.name.charAt(0).toUpperCase();
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(c);
      });
    return groups;
  }, [filtered]);

  const totalClients = mockClients.length;
  const totalRevenue = mockClients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const favoriteCount = mockClients.filter((c) => c.isFavorite).length;

  const filters: { key: typeof filter; label: string; count?: number }[] = [
    { key: "all", label: "Wszyscy" },
    { key: "favorites", label: "Ulubieni", count: favoriteCount },
    { key: "company", label: "Firmy" },
    { key: "individual", label: "Osoby" },
  ];

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
              <h1 className="text-foreground">Klienci</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {totalClients} {totalClients === 1 ? "kontrahent" : "kontrahentów"}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate("/clients/new")}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft"
            >
              <Plus className="w-5 h-5 text-primary-foreground" strokeWidth={2.25} />
            </motion.button>
          </div>

          {/* Highlight card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-4 shadow-soft mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide font-semibold">
                  Łączny obrót
                </p>
                <p className="text-[20px] font-semibold text-foreground tracking-tight">
                  {totalRevenue.toLocaleString("pl-PL")} zł
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
            <input
              type="text"
              placeholder="Szukaj po nazwie, NIP lub mieście..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-card text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-soft"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {filters.map((f) => (
              <motion.button
                key={f.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground shadow-soft"
                }`}
              >
                {f.label}
                {f.count !== undefined && f.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      filter === f.key ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Clients List - grouped */}
      <section className="px-5 py-4 space-y-5">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-[15px] text-muted-foreground">Brak kontrahentów</p>
          </div>
        ) : (
          Object.entries(grouped).map(([letter, clients]) => (
            <div key={letter}>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
                {letter}
              </p>
              <div className="space-y-2">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-card rounded-2xl p-4 shadow-soft cursor-pointer flex items-center gap-3"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        client.type === "company" ? "bg-primary/10" : "bg-accent"
                      }`}
                    >
                      {client.type === "company" ? (
                        <Building2 className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-accent-foreground" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[15px] font-medium text-foreground truncate">
                          {client.name}
                        </h4>
                        {client.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-warning fill-warning flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        {client.nip && <span>NIP {client.nip}</span>}
                        {client.nip && <span>·</span>}
                        <span>{client.city}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[13px] font-semibold text-foreground">
                          {client.totalRevenue.toLocaleString("pl-PL")} zł
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          {client.invoiceCount} fv · {client.lastPurchase}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default Clients;
