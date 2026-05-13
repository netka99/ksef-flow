import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Package, Tag, Box, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

const amount = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Format: np. 12.50");

const productSchema = z.object({
  name: z.string().trim().min(1, "Nazwa jest wymagana").max(255),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  sku: z.string().trim().max(64).optional().or(z.literal("")),
  barcode: z.string().trim().max(64).optional().or(z.literal("")),
  pkwiu: z.string().trim().max(20).optional().or(z.literal("")),
  unit: z.string().trim().min(1, "Jednostka wymagana").max(20),
  price_net: amount,
  price_gross: amount,
  vat_rate: amount,
  min_stock_alert: z
    .string()
    .refine((v) => v === "" || /^\d+$/.test(v), "Liczba całkowita"),
  shelf_life_days: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^\d+$/.test(v), "Liczba całkowita"),
  track_batches: z.boolean(),
  is_active: z.boolean(),
});

const NewProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    barcode: "",
    pkwiu: "",
    unit: "szt",
    price_net: "0",
    price_gross: "0",
    vat_rate: "23",
    min_stock_alert: "0",
    shelf_life_days: "",
    track_batches: true,
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  // Auto compute gross from net + vat
  const recomputeGross = (net: string, vat: string) => {
    if (/^\d+(\.\d{1,2})?$/.test(net) && /^\d+(\.\d{1,2})?$/.test(vat)) {
      const g = (Number(net) * (1 + Number(vat) / 100)).toFixed(2);
      setForm((f) => ({ ...f, price_gross: g }));
    }
  };

  const handleSave = () => {
    const result = productSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      toast.error("Popraw błędy w formularzu");
      return;
    }
    toast.success("Produkt został zapisany");
    setTimeout(() => navigate("/products"), 600);
  };

  const vatOptions = ["0", "5", "8", "23"];

  return (
    <div className="min-h-screen bg-background pb-32">
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
            <h1 className="text-foreground">Nowy produkt</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">Dodaj pozycję do katalogu</p>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 space-y-5">
        {/* Basic */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Package className="w-4 h-4 text-accent-foreground" />
            </div>
            <h3 className="text-[14px] font-semibold text-foreground">Dane podstawowe</h3>
          </div>
          <div className="px-4 pb-3 space-y-3">
            <Field label="Nazwa" required error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="np. Kartacze"
                className={inputCls(errors.name)}
              />
            </Field>
            <Field label="Opis" error={errors.description}>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Opcjonalny opis produktu"
                className={`${inputCls(errors.description)} h-auto py-2.5 resize-none`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Jednostka" required error={errors.unit}>
                <input value={form.unit} onChange={(e) => set("unit", e.target.value)} className={inputCls(errors.unit)} />
              </Field>
              <Field label="Termin przyd. (dni)" error={errors.shelf_life_days}>
                <input
                  value={form.shelf_life_days}
                  onChange={(e) => set("shelf_life_days", e.target.value)}
                  inputMode="numeric"
                  placeholder="np. 30"
                  className={inputCls(errors.shelf_life_days)}
                />
              </Field>
            </div>
          </div>
        </motion.section>

        {/* Pricing */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Tag className="w-4 h-4 text-accent-foreground" />
            </div>
            <h3 className="text-[14px] font-semibold text-foreground">Cennik i VAT</h3>
          </div>
          <div className="px-4 pb-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cena netto" required error={errors.price_net}>
                <input
                  value={form.price_net}
                  onChange={(e) => {
                    set("price_net", e.target.value);
                    recomputeGross(e.target.value, form.vat_rate);
                  }}
                  inputMode="decimal"
                  className={inputCls(errors.price_net)}
                />
              </Field>
              <Field label="Cena brutto" required error={errors.price_gross}>
                <input
                  value={form.price_gross}
                  onChange={(e) => set("price_gross", e.target.value)}
                  inputMode="decimal"
                  className={inputCls(errors.price_gross)}
                />
              </Field>
            </div>
            <Field label="Stawka VAT (%)" required error={errors.vat_rate}>
              <div className="flex gap-2">
                {vatOptions.map((v) => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      set("vat_rate", v);
                      recomputeGross(form.price_net, v);
                    }}
                    className={`flex-1 h-11 rounded-xl text-[14px] font-medium transition-colors ${
                      form.vat_rate === v
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {v}%
                  </motion.button>
                ))}
              </div>
            </Field>
          </div>
        </motion.section>

        {/* Inventory */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Box className="w-4 h-4 text-accent-foreground" />
            </div>
            <h3 className="text-[14px] font-semibold text-foreground">Magazyn</h3>
          </div>
          <div className="px-4 pb-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU" error={errors.sku}>
                <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputCls(errors.sku)} />
              </Field>
              <Field label="Kod kreskowy" error={errors.barcode}>
                <input value={form.barcode} onChange={(e) => set("barcode", e.target.value)} className={inputCls(errors.barcode)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="PKWiU" error={errors.pkwiu}>
                <input value={form.pkwiu} onChange={(e) => set("pkwiu", e.target.value)} className={inputCls(errors.pkwiu)} />
              </Field>
              <Field label="Min. stan alertu" error={errors.min_stock_alert}>
                <input
                  value={form.min_stock_alert}
                  onChange={(e) => set("min_stock_alert", e.target.value)}
                  inputMode="numeric"
                  className={inputCls(errors.min_stock_alert)}
                />
              </Field>
            </div>
          </div>
        </motion.section>

        {/* Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl shadow-soft divide-y divide-border"
        >
          <Toggle
            label="Śledź partie"
            desc="Numery partii, daty produkcji"
            value={form.track_batches}
            onChange={(v) => set("track_batches", v)}
          />
          <Toggle
            label="Aktywny"
            desc="Dostępny przy sprzedaży"
            value={form.is_active}
            onChange={(v) => set("is_active", v)}
          />
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-gradient-to-t from-background via-background to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[16px] flex items-center justify-center gap-2 shadow-soft"
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
          Zapisz produkt
        </motion.button>
      </div>
    </div>
  );
};

const inputCls = (err?: string) =>
  `w-full h-11 px-3.5 rounded-xl bg-secondary text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
    err ? "ring-2 ring-destructive/40" : "focus:ring-primary/30"
  }`;

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-[12px] text-destructive mt-1">{error}</p>}
  </div>
);

const Toggle = ({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="p-4 flex items-center justify-between">
    <div>
      <p className="text-[15px] font-medium text-foreground">{label}</p>
      <p className="text-[12px] text-muted-foreground">{desc}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-7 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
    >
      <motion.div
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 rounded-full bg-card shadow-soft"
      />
    </button>
  </div>
);

export default NewProduct;
