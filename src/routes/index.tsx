import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, Instagram, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import mateaLogo from "@/assets/matea-logo.png";
import heroBg from "@/assets/hero-background.jpg";
import triangleTop from "@/assets/sketch-triangle-top.png";
import tangaBottom from "@/assets/sketch-tanga.png";
import culotteBottom from "@/assets/sketch-culotte.png";

import fabNoir from "@/assets/fabrics/noir.jpg.asset.json";
import fabBleu from "@/assets/fabrics/bleu.jpg.asset.json";
import fabBleuRaye from "@/assets/fabrics/bleu-raye.jpg.asset.json";
import fabCorail from "@/assets/fabrics/corail.jpg.asset.json";
import fabGalactic from "@/assets/fabrics/galactic.jpg.asset.json";
import fabJaune from "@/assets/fabrics/jaune.jpg.asset.json";
import fabMarron from "@/assets/fabrics/marron-satine.jpg.asset.json";
import fabRouge from "@/assets/fabrics/rouge-satine.jpg.asset.json";
import fabShego from "@/assets/fabrics/shego.jpg.asset.json";
import fabVert from "@/assets/fabrics/vert.jpg.asset.json";
import fabAbeille from "@/assets/fabrics/abeille.jpg.asset.json";

import editorial1 from "@/assets/editorial/editorial-1.jpg.asset.json";
import editorial2 from "@/assets/editorial/editorial-2.jpg.asset.json";
import editorial3 from "@/assets/editorial/editorial-3.jpg.asset.json";
import editorial4 from "@/assets/editorial/editorial-4.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const FABRICS = [
  { id: "noir", name: "Noir", img: fabNoir.url },
  { id: "bleu", name: "Bleu", img: fabBleu.url },
  { id: "bleu-raye", name: "Bleu Rayé", img: fabBleuRaye.url },
  { id: "corail", name: "Corail", img: fabCorail.url },
  { id: "galactic", name: "Galactic", img: fabGalactic.url },
  { id: "jaune", name: "Jaune", img: fabJaune.url },
  { id: "marron-satine", name: "Marron Satiné", img: fabMarron.url },
  { id: "rouge-satine", name: "Rouge Satiné", img: fabRouge.url },
  { id: "shego", name: "Shego", img: fabShego.url },
  { id: "vert", name: "Vert", img: fabVert.url },
  { id: "abeille", name: "Abeille", img: fabAbeille.url },
];

const TOPS = [
  { id: "triangle", label: "Le triangle", img: triangleTop },
];
const BOTTOMS = [
  { id: "tanga", label: "Le tanga", img: tangaBottom },
  { id: "culotte", label: "La culotte", img: culotteBottom },
];
const SIZES = ["XS", "S", "M", "L", "XL"];

const PRICE = 85;
const SHIPPING = 6;

type CartItem = {
  id: string;
  topId: string;
  bottomId: string;
  sizeTop: string;
  sizeBottom: string;
  fabricA: string;
  fabricB: string;
  price: number;
};

function CartIcon({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Panier"
      className="fixed top-5 right-5 sm:top-6 sm:right-6 z-40 w-11 h-11 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background flex items-center justify-center transition-colors shadow-sm"
    >
      <ShoppingBag size={22} className="text-foreground" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-foreground text-background text-[11px] font-medium flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function Hero({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0.55)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative">
        <h1 className="sr-only">MATEA</h1>
        <img
          src={mateaLogo}
          alt="MATEA"
          className="relative w-[260px] sm:w-[320px] h-auto"
        />
      </div>
      <p className="mt-3 text-base sm:text-lg md:text-xl text-foreground/90 font-light">
        maillots réversibles &amp; faits main, Marseille
      </p>
      <button
        onClick={onOpen}
        className="mt-16 sm:mt-24 inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm sm:text-base font-light text-background transition-transform hover:scale-105"
      >
        Crée ton maillot
      </button>
    </section>
  );
}

function Editorial() {
  const photos = [editorial1, editorial2, editorial3, editorial4];
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="w-full">
        <div className="grid grid-cols-2 gap-0.5">
          {photos.map((p, i) => (
            <img
              key={i}
              src={p.url}
              alt={`MATEA ${i + 1}`}
              loading="lazy"
              className="w-full aspect-square object-cover"
            />
          ))}
        </div>
        <p className="font-light italic text-center text-lg sm:text-xl text-foreground/80 mt-12 sm:mt-16 max-w-2xl mx-auto px-6">
          Chaque maillot est unique, cousu à la main à Marseille.
        </p>
        <div className="flex justify-center mt-6">
          <a
            href="https://www.instagram.com/matea.swimwear/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram MATEA"
            className="text-foreground transition-opacity hover:opacity-60"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="flex-1 flex items-center gap-2">
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${
              n <= step ? "bg-foreground" : "bg-border"
            }`}
          />
        </div>
      ))}
      <span className="ml-3 text-xs font-light text-muted-foreground whitespace-nowrap">
        {step} / 5
      </span>
    </div>
  );
}

function StepNav({
  step,
  setStep,
  canNext,
  nextLabel = "Suivant",
}: {
  step: number;
  setStep: (n: number) => void;
  canNext: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
      <button
        onClick={() => setStep(step - 1)}
        disabled={step === 1}
        className="text-sm font-light text-foreground disabled:opacity-30 hover:underline"
      >
        ← Retour
      </button>
      {step < 5 && (
        <button
          onClick={() => setStep(step + 1)}
          disabled={!canNext}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-2.5 text-sm font-light text-background disabled:opacity-30 transition-transform hover:scale-105"
        >
          {nextLabel} →
        </button>
      )}
    </div>
  );
}

function ShapePicker({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; img: string }[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`group relative rounded-xl border-2 p-3 sm:p-5 transition-all bg-secondary/30 ${
              selected ? "border-foreground" : "border-transparent hover:border-border"
            }`}
          >
            <img
              src={o.img}
              alt={o.label}
              className="w-full h-36 sm:h-48 object-contain"
              loading="lazy"
            />
            <p className="mt-2 text-sm font-light">{o.label}</p>
          </button>
        );
      })}
    </div>
  );
}

function SizeRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-light text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {SIZES.map((s) => {
          const selected = value === s;
          return (
            <button
              key={s}
              onClick={() => onChange(s)}
              className={`px-4 py-2 rounded-full text-sm font-light border transition-all ${
                selected
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FabricPicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
  disabled?: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-light text-muted-foreground mb-2">{label}</p>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {FABRICS.map((f) => {
          const selected = value === f.id;
          const isDisabled = disabled === f.id;
          return (
            <button
              key={f.id}
              onClick={() => !isDisabled && onChange(f.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all ${
                selected ? "border-foreground" : "border-transparent hover:border-border"
              } ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <img
                src={f.img}
                alt={f.name}
                loading="lazy"
                className="w-full aspect-square object-cover rounded-md"
              />
              <span className="text-[10px] sm:text-[11px] font-light text-center leading-tight">
                {f.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrderRecap({
  selectedTop,
  selectedBottom,
  sizeTop,
  sizeBottom,
  fabA,
  fabB,
  total,
}: {
  selectedTop?: { label: string };
  selectedBottom?: { label: string };
  sizeTop: string | null;
  sizeBottom: string | null;
  fabA?: { name: string; img: string };
  fabB?: { name: string; img: string };
  total: number;
}) {
  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-3 text-sm font-light">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
  const FabricLine = ({ f }: { f?: { name: string; img: string } }) =>
    f ? (
      <span className="inline-flex items-center gap-2">
        <img src={f.img} alt={f.name} className="w-6 h-6 rounded object-cover" />
        {f.name}
      </span>
    ) : (
      <span>—</span>
    );
  return (
    <div className="rounded-xl bg-secondary/50 p-4 sm:p-5 space-y-2">
      <Row label="Haut" value={`${selectedTop?.label ?? "—"}, taille ${sizeTop ?? "—"}`} />
      <Row label="Bas" value={`${selectedBottom?.label ?? "—"}, taille ${sizeBottom ?? "—"}`} />
      <Row label="Côté A" value={<FabricLine f={fabA} />} />
      <Row label="Côté B" value={<FabricLine f={fabB} />} />
      <Row label="Livraison France Standard" value={`${SHIPPING}€`} />
      <div className="pt-2 mt-2 border-t border-border flex items-center justify-between text-base font-light">
        <span>Total</span>
        <span>{total}€</span>
      </div>
    </div>
  );
}

function ConfiguratorOverlay({
  onClose,
  onAddToCart,
}: {
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const [step, setStep] = useState(1);
  const [top, setTop] = useState<string | null>(null);
  const [bottom, setBottom] = useState<string | null>(null);
  const [sizeTop, setSizeTop] = useState<string | null>(null);
  const [sizeBottom, setSizeBottom] = useState<string | null>(null);
  const [fabricA, setFabricA] = useState<string | null>(null);
  const [fabricB, setFabricB] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const setFabricBSafe = (v: string) => {
    if (v === fabricA) {
      setWarning("Les deux côtés doivent être différents.");
      return;
    }
    setWarning(null);
    setFabricB(v);
  };
  const setFabricASafe = (v: string) => {
    if (v === fabricB) {
      setWarning("Les deux côtés doivent être différents.");
      return;
    }
    setWarning(null);
    setFabricA(v);
  };

  const canNext =
    (step === 1 && !!top) ||
    (step === 2 && !!bottom) ||
    (step === 3 && !!sizeTop && !!sizeBottom) ||
    (step === 4 && !!fabricA && !!fabricB);

  const selectedTop = TOPS.find((t) => t.id === top);
  const selectedBottom = BOTTOMS.find((b) => b.id === bottom);
  const fabA = FABRICS.find((f) => f.id === fabricA);
  const fabB = FABRICS.find((f) => f.id === fabricB);

  const titles: Record<number, string> = {
    1: "Choisis ton haut",
    2: "Choisis ton bas",
    3: "Choisis ta taille",
    4: "Choisis tes tissus",
    5: "Récapitulatif",
  };

  const handleAddToCart = () => {
    if (!top || !bottom || !sizeTop || !sizeBottom || !fabricA || !fabricB) return;
    onAddToCart({
      id: crypto.randomUUID(),
      topId: top,
      bottomId: bottom,
      sizeTop,
      sizeBottom,
      fabricA,
      fabricB,
      price: PRICE,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full w-full flex items-start sm:items-center justify-center p-2 sm:p-6">
        <div className="relative w-full max-w-3xl bg-background rounded-2xl shadow-2xl p-4 sm:p-8 my-4">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-secondary hover:bg-foreground hover:text-background flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <ProgressBar step={step} />
          <h3 className="text-xl sm:text-2xl font-light mb-5 pr-10">{titles[step]}</h3>

          {step === 1 && <ShapePicker options={TOPS} value={top} onChange={setTop} />}
          {step === 2 && (
            <ShapePicker options={BOTTOMS} value={bottom} onChange={setBottom} />
          )}
          {step === 3 && (
            <div className="space-y-5">
              <SizeRow label="Haut" value={sizeTop} onChange={setSizeTop} />
              <SizeRow label="Bas" value={sizeBottom} onChange={setSizeBottom} />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-5">
              <FabricPicker
                label="Côté A"
                value={fabricA}
                onChange={setFabricASafe}
                disabled={fabricB}
              />
              <FabricPicker
                label="Côté B"
                value={fabricB}
                onChange={setFabricBSafe}
                disabled={fabricA}
              />
              {warning && (
                <p className="text-sm text-destructive font-light">{warning}</p>
              )}
            </div>
          )}
          {step === 5 && (
            <div className="space-y-5">
              <OrderRecap
                selectedTop={selectedTop}
                selectedBottom={selectedBottom}
                sizeTop={sizeTop}
                sizeBottom={sizeBottom}
                fabA={fabA}
                fabB={fabB}
                total={PRICE + SHIPPING}
              />
              <button
                onClick={handleAddToCart}
                className="block w-full text-center rounded-full bg-foreground px-8 py-4 text-base font-light text-background transition-transform hover:scale-[1.02]"
              >
                Ajouter au panier
              </button>
            </div>
          )}

          {step < 5 && <StepNav step={step} setStep={setStep} canNext={canNext} />}
          {step === 5 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-light text-foreground hover:underline"
              >
                ← Retour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartOverlay({
  items,
  onClose,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onCheckout: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const shipping = items.length > 0 ? SHIPPING : 0;
  const total = subtotal + shipping;

  const handleClick = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    onCheckout(email.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full w-full flex items-start sm:items-center justify-center p-2 sm:p-6">
        <div className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl p-4 sm:p-8 my-4">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-secondary hover:bg-foreground hover:text-background flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl sm:text-2xl font-light mb-5">Panier</h3>

          {items.length === 0 ? (
            <p className="text-center text-muted-foreground font-light py-12">
              Ton panier est vide.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => {
                  const t = TOPS.find((x) => x.id === item.topId);
                  const b = BOTTOMS.find((x) => x.id === item.bottomId);
                  const a = FABRICS.find((f) => f.id === item.fabricA);
                  const bc = FABRICS.find((f) => f.id === item.fabricB);
                  return (
                    <div
                      key={item.id}
                      className="relative p-4 rounded-xl bg-secondary/40"
                    >
                      <button
                        onClick={() => onRemove(item.id)}
                        className="absolute top-3 right-3 text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Retirer
                      </button>
                      <div className="space-y-1.5 text-sm font-light pr-16">
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Haut</span>
                          <span>{t?.label}, taille {item.sizeTop}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Bas</span>
                          <span>{b?.label}, taille {item.sizeBottom}</span>
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                          <span className="text-muted-foreground">Côté A</span>
                          <span className="inline-flex items-center gap-2">
                            {a && <img src={a.img} alt={a.name} className="w-5 h-5 rounded object-cover" />}
                            {a?.name ?? "—"}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                          <span className="text-muted-foreground">Côté B</span>
                          <span className="inline-flex items-center gap-2">
                            {bc && <img src={bc.img} alt={bc.name} className="w-5 h-5 rounded object-cover" />}
                            {bc?.name ?? "—"}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3 pt-1.5 border-t border-border">
                          <span className="text-muted-foreground">Prix</span>
                          <span>{item.price}€</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-border space-y-1.5 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{subtotal}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison France Standard</span>
                  <span>{shipping}€</span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{total}€</span>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-xs font-light text-muted-foreground mb-2">
                  Email pour la confirmation
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(false);
                  }}
                  placeholder="ton@email.com"
                  className="w-full px-4 py-3 rounded-full border border-border bg-background text-sm font-light focus:border-foreground outline-none transition-colors"
                />
                {emailError && (
                  <p className="mt-2 text-xs text-destructive font-light">
                    Merci d'entrer un email valide.
                  </p>
                )}
              </div>

              <button
                onClick={handleClick}
                className="block w-full text-center rounded-full bg-foreground px-8 py-4 mt-5 text-base font-light text-background transition-transform hover:scale-[1.02]"
              >
                Commander
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 text-center text-sm font-light text-muted-foreground border-t border-border">
      <p className="text-base italic">
        MATEA — fait main à Marseille
      </p>
      <p className="mt-2">© {new Date().getFullYear()} MATEA</p>
    </footer>
  );
}

function Index() {
  const [configOpen, setConfigOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("matea-cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("matea-cart", JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    setConfigOpen(false);
  };

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async (email: string) => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { items: cart, email, origin: window.location.origin },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL Stripe manquante");
      }
    } catch (e) {
      console.error(e);
      toast.error("Le paiement n'a pas pu démarrer. Réessaie.");
      setCheckoutLoading(false);
    }
  };

  // Handle return from Stripe Checkout
  useEffect(() => {
    const url = new URL(window.location.href);
    const payment = url.searchParams.get("payment");
    const sessionId = url.searchParams.get("session_id");
    if (payment === "success" && sessionId) {
      (async () => {
        try {
          const { data } = await supabase.functions.invoke("verify-payment", {
            body: { session_id: sessionId },
          });
          if (data?.paid) {
            setCart([]);
            try { localStorage.removeItem("matea-cart"); } catch { /* ignore */ }
            toast.success("Paiement confirmé — merci pour ta commande !", { duration: 6000 });
          }
        } catch (e) {
          console.error(e);
        } finally {
          url.searchParams.delete("payment");
          url.searchParams.delete("session_id");
          window.history.replaceState({}, "", url.pathname + (url.search || ""));
        }
      })();
    } else if (payment === "cancel") {
      toast("Paiement annulé.");
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
    }
  }, []);

  return (
    <main className="bg-background text-foreground">
      <CartIcon count={cart.length} onClick={() => setCartOpen(true)} />
      <Hero onOpen={() => setConfigOpen(true)} />
      <Editorial />
      <Footer />
      {configOpen && (
        <ConfiguratorOverlay
          onClose={() => setConfigOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
      {cartOpen && (
        <CartOverlay
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(id) => setCart((prev) => prev.filter((i) => i.id !== id))}
          onCheckout={handleCheckout}
        />
      )}
    </main>
  );
}
