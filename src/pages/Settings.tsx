import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Building2, 
  Key, 
  Shield, 
  Moon, 
  Bell, 
  HelpCircle, 
  FileText,
  LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  destructive?: boolean;
  trailing?: React.ReactNode;
}

function SettingItem({ icon, label, sublabel, onClick, destructive, trailing }: SettingItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        destructive ? "bg-destructive/10" : "bg-accent"
      }`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${destructive ? "text-destructive" : "text-foreground"}`}>
          {label}
        </p>
        {sublabel && (
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        )}
      </div>
      {trailing || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </motion.button>
  );
}

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <h1 className="text-lg font-semibold text-foreground">Ustawienia</h1>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">AK</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Anna Kowalska</h2>
              <p className="text-sm text-muted-foreground">anna@sklepabc.pl</p>
              <p className="text-xs text-muted-foreground mt-1">Sklep ABC • Administrator</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Settings Groups */}
      <section className="px-4 space-y-6">
        {/* Account */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-2">
            Konto
          </p>
          <div className="space-y-2">
            <SettingItem
              icon={<User className="w-5 h-5 text-accent-foreground" />}
              label="Profil"
              sublabel="Dane osobowe i kontaktowe"
            />
            <SettingItem
              icon={<Building2 className="w-5 h-5 text-accent-foreground" />}
              label="Firma"
              sublabel="Dane firmy i NIP"
            />
          </div>
        </div>

        {/* KSeF */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-2">
            KSeF
          </p>
          <div className="space-y-2">
            <SettingItem
              icon={<Key className="w-5 h-5 text-accent-foreground" />}
              label="Token autoryzacyjny"
              sublabel="Ważny do 15.03.2024"
            />
            <SettingItem
              icon={<Shield className="w-5 h-5 text-accent-foreground" />}
              label="Certyfikaty"
              sublabel="Podpis kwalifikowany"
            />
          </div>
        </div>

        {/* App */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-2">
            Aplikacja
          </p>
          <div className="space-y-2">
            <SettingItem
              icon={<Moon className="w-5 h-5 text-accent-foreground" />}
              label="Ciemny motyw"
              sublabel="Automatyczny"
              trailing={
                <div className="w-12 h-7 rounded-full bg-secondary relative">
                  <div className="absolute left-1 top-1 w-5 h-5 rounded-full bg-card shadow-sm" />
                </div>
              }
            />
            <SettingItem
              icon={<Bell className="w-5 h-5 text-accent-foreground" />}
              label="Powiadomienia"
              sublabel="Włączone"
            />
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-2">
            Pomoc
          </p>
          <div className="space-y-2">
            <SettingItem
              icon={<HelpCircle className="w-5 h-5 text-accent-foreground" />}
              label="Centrum pomocy"
            />
            <SettingItem
              icon={<FileText className="w-5 h-5 text-accent-foreground" />}
              label="Regulamin i polityka"
            />
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <SettingItem
            icon={<LogOut className="w-5 h-5 text-destructive" />}
            label="Wyloguj się"
            destructive
          />
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Settings;
