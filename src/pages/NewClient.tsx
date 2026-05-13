import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Building2, MapPin, CreditCard, Phone, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

// Polish NIP checksum validator
const isValidNIP = (nip: string) => {
  const digits = nip.replace(/\D/g, "");
  if (digits.length !== 10) return false;
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
  const checksum = sum % 11;
  if (checksum === 10) return false;
  return checksum === Number(digits[9]);
};

const clientSchema = z.object({
  name: z.string().trim().min(1, "Nazwa jest wymagana").max(255),
  company_name: z.string().trim().max(255).optional().or(z.literal("")),
  country: z.string().trim().length(2, "Kraj musi mieć 2 znaki"),
  nip: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || isValidNIP(v), "Nieprawidłowy NIP"),
  email: z.string().trim().email("Nieprawidłowy email").max(255).optional().or(z.literal("")),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => {
      if (!v) return true;
      const d = v.replace(/\D/g, "");
      return d.length >= 9 && d.length <= 15;
    }, "Telefon musi mieć 9–15 cyfr"),
  street: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
  delivery_days: z.string().trim().max(100).optional().or(z.literal("")),
  distance_km: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^\d+$/.test(v), "Tylko liczby całkowite"),
  payment_terms: z
    .string()
    .refine((v) => /^\d+$/.test(v) && Number(v) >= 0 && Number(v) <= 36500, "0–36500 dni"),
  bank: z.string().trim().max(100).optional().or(z.literal("")),
  iban: z.string().trim().max(34).optional().or(z.literal("")),
  is_active: z.boolean(),
});

type Field = {
  key: keyof z.infer<typeof clientSchema>;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  icon?: React.ElementType;
};

const NewClient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    country: "PL",
    nip: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postal_code: "",
    delivery_days: "",
    distance_km: "",
    payment_terms: "14",
    bank: "",
    iban: "",
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleSave = () => {
    const result = clientSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      toast.error("Popraw błędy w formularzu");
      return;
    }
    toast.success("Klient został zapisany");
    setTimeout(() => navigate("/clients"), 600);
  };

  const sections: { title: string; icon: React.ElementType; fields: Field[] }[] = [
    {
      title: "Dane podstawowe",
      icon: User,
      fields: [
        { key: "name", label: "Nazwa wyświetlana", required: true, placeholder: "np. Jan Kowalski" },
        { key: "company_name", label: "Nazwa firmy", placeholder: "Opcjonalnie" },
        { key: "nip", label: "NIP", placeholder: "10 cyfr" },
      ],
    },
    {
      title: "Kontakt",
      icon: Phone,
      fields: [
        { key: "email", label: "Email", type: "email", placeholder: "kontakt@firma.pl" },
        { key: "phone", label: "Telefon", placeholder: "+48 600 000 000" },
      ],
    },
    {
      title: "Adres",
      icon: MapPin,
      fields: [
        { key: "country", label: "Kraj", required: true, placeholder: "PL" },
        { key: "street", label: "Ulica", placeholder: "ul. Przykładowa 1" },
        { key: "postal_code", label: "Kod pocztowy", placeholder: "00-000" },
        { key: "city", label: "Miasto", placeholder: "Warszawa" },
        { key: "distance_km", label: "Odległość (km)", placeholder: "np. 12" },
        { key: "delivery_days", label: "Dni dostawy", placeholder: "Pon, Śr, Pt" },
      ],
    },
    {
      title: "Płatność",
      icon: CreditCard,
      fields: [
        { key: "payment_terms", label: "Termin płatności (dni)", required: true, placeholder: "14" },
        { key: "bank", label: "Bank", placeholder: "np. PKO BP" },
        { key: "iban", label: "IBAN", placeholder: "PL00 0000 0000 0000 0000 0000 0000" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
        <div className="px-5 pt-14 pb-4 flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-foreground">Nowy klient</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">Dodaj kontrahenta do bazy</p>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 space-y-5">
        {sections.map((section, sIdx) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.05 }}
            className="bg-card rounded-2xl shadow-soft overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <section.icon className="w-4 h-4 text-accent-foreground" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="px-4 pb-3 space-y-3">
              {section.fields.map((f) => (
                <div key={f.key as string}>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">
                    {f.label}
                    {f.required && <span className="text-destructive ml-0.5">*</span>}
                  </label>
                  <input
                    type={f.type || "text"}
                    value={String(form[f.key] ?? "")}
                    onChange={(e) => set(f.key as string, e.target.value)}
                    placeholder={f.placeholder}
                    className={`w-full h-11 px-3.5 rounded-xl bg-secondary text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                      errors[f.key as string]
                        ? "ring-2 ring-destructive/40"
                        : "focus:ring-primary/30"
                    }`}
                  />
                  {errors[f.key as string] && (
                    <p className="text-[12px] text-destructive mt-1">{errors[f.key as string]}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* Active toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-soft p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-[15px] font-medium text-foreground">Aktywny klient</p>
            <p className="text-[12px] text-muted-foreground">Widoczny przy wystawianiu faktur</p>
          </div>
          <button
            onClick={() => set("is_active", !form.is_active)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              form.is_active ? "bg-primary" : "bg-muted"
            }`}
          >
            <motion.div
              animate={{ x: form.is_active ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-card shadow-soft"
            />
          </button>
        </motion.div>
      </div>

      {/* Sticky save */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-gradient-to-t from-background via-background to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[16px] flex items-center justify-center gap-2 shadow-soft"
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
          Zapisz klienta
        </motion.button>
      </div>
    </div>
  );
};

export default NewClient;
