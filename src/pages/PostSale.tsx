import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  FileText,
  Package,
  ArrowRight,
  Send,
  CheckCircle2,
  Building2,
  User,
  MapPin,
  Hash,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

type Step = "choose" | "invoice-form" | "wz-summary" | "preview" | "ksef-sent";

interface InvoiceData {
  buyerName: string;
  buyerNip: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostal: string;
}

const emptyInvoice: InvoiceData = {
  buyerName: "",
  buyerNip: "",
  buyerAddress: "",
  buyerCity: "",
  buyerPostal: "",
};

// Mock items from checkout
const mockItems = [
  { name: "Kartacze", qty: 3, price: 7.0, total: 21.0 },
  { name: "Babka ziemniaczana", qty: 2, price: 12.0, total: 24.0 },
  { name: "Pierogi ruskie", qty: 1, price: 15.0, total: 13.5 },
];
const mockTotal = 58.5;

const PostSale = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("choose");
  const [docType, setDocType] = useState<"invoice" | "wz" | null>(null);
  const [invoice, setInvoice] = useState<InvoiceData>(emptyInvoice);
  const [sending, setSending] = useState(false);

  const canSubmitInvoice =
    invoice.buyerName.trim() && invoice.buyerNip.trim().length >= 10;

  const handleSendToKsef = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("ksef-sent");
    }, 2000);
  };

  const stepTitle: Record<Step, string> = {
    choose: "Typ dokumentu",
    "invoice-form": "Dane do faktury",
    "wz-summary": "Wydanie zewnętrzne",
    preview: docType === "invoice" ? "Podgląd faktury" : "Podgląd WZ",
    "ksef-sent": "Wysłano do KSeF",
  };

  const handleBack = () => {
    if (step === "choose") navigate("/checkout");
    else if (step === "invoice-form" || step === "wz-summary") setStep("choose");
    else if (step === "preview") setStep(docType === "invoice" ? "invoice-form" : "wz-summary");
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-5 pt-14 pb-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-foreground">{stepTitle[step]}</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {step === "ksef-sent" ? "Dokument wysłany" : "Sprzedaż zapisana"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* Step 1: Choose document type */}
        {step === "choose" && (
          <motion.section
            key="choose"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="px-5 py-6 space-y-4"
          >
            <p className="text-[15px] text-muted-foreground">
              Wybierz rodzaj dokumentu do wygenerowania:
            </p>

            {/* Invoice option */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setDocType("invoice");
                setStep("invoice-form");
              }}
              className="w-full bg-card rounded-2xl p-5 shadow-soft text-left flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-semibold text-foreground">Faktura VAT</h3>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Pełny dokument fiskalny z danymi nabywcy. Wysyłka do KSeF.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.button>

            {/* WZ option */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setDocType("wz");
                setStep("wz-summary");
              }}
              className="w-full bg-card rounded-2xl p-5 shadow-soft text-left flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
                <Package className="w-7 h-7 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-semibold text-foreground">Wydanie zewnętrzne (WZ)</h3>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Dokument magazynowy bez danych fiskalnych.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.button>
          </motion.section>
        )}

        {/* Step 2a: Invoice form */}
        {step === "invoice-form" && (
          <motion.section
            key="invoice-form"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="px-5 py-6 space-y-4"
          >
            <p className="text-[13px] text-muted-foreground mb-2">
              Uzupełnij dane nabywcy do faktury
            </p>

            {/* NIP */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                NIP nabywcy *
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={invoice.buyerNip}
                onChange={(e) =>
                  setInvoice((p) => ({ ...p, buyerNip: e.target.value.replace(/\D/g, "") }))
                }
                placeholder="0000000000"
                className="w-full h-12 px-4 rounded-xl bg-card border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Buyer name */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Nazwa firmy / Imię i nazwisko *
              </label>
              <input
                type="text"
                value={invoice.buyerName}
                onChange={(e) => setInvoice((p) => ({ ...p, buyerName: e.target.value }))}
                placeholder="Np. Jan Kowalski lub Firma Sp. z o.o."
                className="w-full h-12 px-4 rounded-xl bg-card border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Adres
              </label>
              <input
                type="text"
                value={invoice.buyerAddress}
                onChange={(e) => setInvoice((p) => ({ ...p, buyerAddress: e.target.value }))}
                placeholder="Ulica i numer"
                className="w-full h-12 px-4 rounded-xl bg-card border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  value={invoice.buyerPostal}
                  onChange={(e) => setInvoice((p) => ({ ...p, buyerPostal: e.target.value }))}
                  placeholder="00-000"
                  maxLength={6}
                  className="w-28 h-12 px-4 rounded-xl bg-card border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <input
                  type="text"
                  value={invoice.buyerCity}
                  onChange={(e) => setInvoice((p) => ({ ...p, buyerCity: e.target.value }))}
                  placeholder="Miasto"
                  className="flex-1 h-12 px-4 rounded-xl bg-card border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={!canSubmitInvoice}
                onClick={() => setStep("preview")}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-[17px] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Podgląd faktury
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* Step 2b: WZ Summary */}
        {step === "wz-summary" && (
          <motion.section
            key="wz-summary"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="px-5 py-6 space-y-4"
          >
            <DocumentPreviewCard title="WZ" items={mockItems} total={mockTotal} buyer={null} />

            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStep("preview");
                }}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-[17px] flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Podgląd WZ
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* Step 3: Preview */}
        {step === "preview" && (
          <motion.section
            key="preview"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="px-5 py-6 space-y-4"
          >
            <DocumentPreviewCard
              title={docType === "invoice" ? "Faktura VAT" : "WZ"}
              items={mockItems}
              total={mockTotal}
              buyer={docType === "invoice" ? invoice : null}
            />

            <div className="flex gap-3 pt-2">
              {docType === "invoice" ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendToKsef}
                  disabled={sending}
                  className="flex-1 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-[17px] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Wyślij do KSeF
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="flex-1 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-[17px] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Zatwierdź WZ
                </motion.button>
              )}
            </div>
          </motion.section>
        )}

        {/* Step 4: KSeF Sent confirmation */}
        {step === "ksef-sent" && (
          <motion.section
            key="ksef-sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-12 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-[22px] font-bold text-foreground mb-2">
              Faktura wysłana!
            </h2>
            <p className="text-[15px] text-muted-foreground mb-2">
              Dokument został przesłany do Krajowego Systemu e-Faktur.
            </p>
            <div className="bg-card rounded-2xl p-4 shadow-soft w-full mt-4 space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Numer faktury</span>
                <span className="text-foreground font-medium">FV/2026/02/006</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Numer KSeF</span>
                <span className="text-primary font-mono text-[13px]">KSeF-2026-00426</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Status</span>
                <span className="text-primary font-medium">Wysłano ✓</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-[17px] mt-8"
            >
              Wróć do panelu
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

/* Reusable document preview card */
const DocumentPreviewCard = ({
  title,
  items,
  total,
  buyer,
}: {
  title: string;
  items: { name: string; qty: number; price: number; total: number }[];
  total: number;
  buyer: InvoiceData | null;
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      {/* Doc header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
            <p className="text-[12px] text-muted-foreground">
              {new Date().toLocaleDateString("pl-PL")}
            </p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {/* Buyer info */}
            {buyer && (
              <div className="p-4 border-b border-border space-y-1">
                <p className="text-[12px] text-muted-foreground uppercase tracking-wider">Nabywca</p>
                <p className="text-[14px] font-medium text-foreground">{buyer.buyerName}</p>
                <p className="text-[13px] text-muted-foreground">NIP: {buyer.buyerNip}</p>
                {buyer.buyerAddress && (
                  <p className="text-[13px] text-muted-foreground">
                    {buyer.buyerAddress}
                    {buyer.buyerPostal && `, ${buyer.buyerPostal}`}
                    {buyer.buyerCity && ` ${buyer.buyerCity}`}
                  </p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="p-4 space-y-3">
              <p className="text-[12px] text-muted-foreground uppercase tracking-wider">Pozycje</p>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-[14px]">
                  <span className="text-foreground">
                    {item.name}{" "}
                    <span className="text-muted-foreground">×{item.qty}</span>
                  </span>
                  <span className="font-medium text-foreground">{item.total.toFixed(2)} zł</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-[16px] font-semibold text-foreground">Razem</span>
                <span className="text-[18px] font-bold text-foreground">{total.toFixed(2)} zł</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostSale;
