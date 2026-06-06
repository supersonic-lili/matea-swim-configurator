import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, Instagram, ShoppingBag } from "lucide-react";
import { FabricSwimsuit } from "@/components/SwimsuitDisplay";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import mateaLogo from "@/assets/matea-logo.png";
import triangleTop from "@/assets/sketch-triangle-top.png";
import tangaBottom from "@/assets/sketch-tanga.png";
import culotteBottom from "@/assets/sketch-culotte.png";

// Bundled fabric swatches (real binary files; Vite will hash + ship them).
import fabNoir from "@/assets/fabrics-bundled/noir.jpg";
import fabBleu from "@/assets/fabrics-bundled/bleu.jpg";
import fabCorail from "@/assets/fabrics-bundled/corail.jpg";
import fabJaune from "@/assets/fabrics-bundled/jaune.jpg";
import fabMarron from "@/assets/fabrics-bundled/marron-satine.jpg";
import fabRouge from "@/assets/fabrics-bundled/rouge-satine.jpg";
import fabVert from "@/assets/fabrics-bundled/vert.jpg";
import fabOrange from "@/assets/fabrics-bundled/orange.jpg";
import fabRose from "@/assets/fabrics-bundled/rose.jpg";
import fabBlackWater from "@/assets/fabrics-bundled/black-water.jpg";
import fabDisco from "@/assets/fabrics-bundled/disco.jpg";
import fabFire from "@/assets/fabrics-bundled/fire.jpg";
import fabFog from "@/assets/fabrics-bundled/fog.jpg";
import fabFruits from "@/assets/fabrics-bundled/fruits.jpg";
import fabNight from "@/assets/fabrics-bundled/night.jpg";
import fabPrune from "@/assets/fabrics-bundled/prune.jpg";

// Static images served from /public/images so Netlify includes them in the build.
const heroAsset = { url: "/images/hero.jpg" };
const editorial5 = { url: "/images/editorial-5.jpg" };
const editorial6 = { url: "/images/editorial-6.jpg" };
const editorial7 = { url: "/images/editorial-7.jpg" };

export const Route = createFileRoute("/")({
  component: Index,
});

// Order required: Noir, Bleu, Corail, Jaune, Vert, Marron Satiné, Rouge Satiné,
// Bleu Rayé, Abeille, Shego, Galactic.
const FABRICS = [
  { id: "noir", name: "Noir", img: fabNoir },
  { id: "bleu", name: "Bleu", img: fabBleu },
  { id: "corail", name: "Corail", img: fabCorail },
  { id: "jaune", name: "Jaune", img: fabJaune },
  { id: "vert", name: "Vert", img: fabVert },
  { id: "marron-satine", name: "Marron Satiné", img: fabMarron },
  { id: "rouge-satine", name: "Rouge Satiné", img: fabRouge },
  { id: "orange", name: "Orange", img: fabOrange },
  { id: "rose", name: "Rose", img: fabRose },
  { id: "fire", name: "Fire", img: fabFire },
  { id: "fruits", name: "Fruits", img: fabFruits },
  { id: "night", name: "Night", img: fabNight },
  { id: "black-water", name: "Black Water", img: fabBlackWater },
  { id: "fog", name: "Fog", img: fabFog },
  { id: "disco", name: "Disco", img: fabDisco },
  { id: "prune", name: "Prune", img: fabPrune },
];

const TOPS = [
  { id: "triangle", label: "Le Triangle", img: triangleTop },
];
const BOTTOMS = [
  { id: "tanga", label: "Le Tanga", img: tangaBottom },
  { id: "culotte", label: "La Culotte Échancrée", img: culotteBottom },
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
        backgroundImage: `linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.45)), url(${heroAsset.url})`,
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
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          <img
            src={editorial5.url}
            alt="MATEA 1"
            loading="lazy"
            className="w-full h-full object-cover md:row-span-2 aspect-[3/4]"
          />
          <div className="grid grid-cols-1 md:grid-rows-2 gap-0.5">
            <img
              src={editorial6.url}
              alt="MATEA 2"
              loading="lazy"
              className="w-full h-full object-cover aspect-[3/2]"
            />
            <img
              src={editorial7.url}
              alt="MATEA 3"
              loading="lazy"
              className="w-full h-full object-cover aspect-[3/2]"
            />
          </div>
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
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`group relative rounded-lg border-2 px-3 pt-3 pb-6 transition-all bg-secondary/30 min-h-[44px] ${
              selected ? "border-foreground" : "border-transparent hover:border-border"
            }`}
          >
            <img
              src={o.img}
              alt={o.label}
              className="w-full h-28 sm:h-36 object-contain"
              loading="lazy"
            />
            <p className="mt-6 text-xs sm:text-sm font-light leading-tight">{o.label}</p>
          </button>
        );
      })}
    </div>
  );
}

function SizeRow({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SIZES.map((s) => {
        const selected = value === s;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`min-w-[44px] min-h-[44px] px-4 rounded-full text-sm font-light border transition-all ${
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
  );
}

function FabricPicker({
  value,
  onChange,
  disabled,
}: {
  value: string | null;
  onChange: (v: string) => void;
  disabled?: string | null;
}) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
      {FABRICS.map((f) => {
        const selected = value === f.id;
        const isDisabled = disabled === f.id;
        return (
          <button
            key={f.id}
            onClick={() => !isDisabled && onChange(f.id)}
            aria-label={f.name}
            title={f.name}
            className={`relative aspect-square w-full rounded-full overflow-hidden transition-all ${
              selected
                ? "ring-2 ring-background ring-offset-2 ring-offset-foreground shadow-md"
                : "hover:opacity-90"
            } ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <img
              src={f.img}
              alt={f.name}
              loading="lazy"
              className="w-full h-full object-cover rounded-full"
            />
          </button>
        );
      })}
    </div>
  );
}

function SwimsuitPreview({
  bottomId,
  fabAImg,
  fabBImg,
}: {
  bottomId?: string;
  fabAImg?: string;
  fabBImg?: string;
}) {
  const Side = ({ fab, label, uid }: { fab?: string; label: string; uid: string }) => (
    <div className="flex-1 flex flex-col items-center gap-3">
      <div className="w-full bg-white">
        <FabricSwimsuit bottomId={bottomId} fabricUrl={fab} uid={uid} />
      </div>
      <span className="text-[11px] font-light text-foreground uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
  );
  return (
    <div className="flex gap-4 mx-auto max-w-md">
      <Side fab={fabAImg} label="Côté A" uid="a" />
      <Side fab={fabBImg} label="Côté B" uid="b" />
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
    <div className="rounded-xl bg-secondary/50 p-4 space-y-2">
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

const STEP_TITLES: Record<number, string> = {
  1: "Ton maillot",
  2: "Tes tissus",
  3: "Récapitulatif",
};

function ConfiguratorOverlay({
  onClose,
  onAddToCart,
}: {
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const [step, setStep] = useState(1);
  const [top, setTop] = useState<string | null>(TOPS[0]?.id ?? null);
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
    (step === 1 && !!top && !!bottom && !!sizeTop && !!sizeBottom) ||
    (step === 2 && !!fabricA && !!fabricB);

  const selectedTop = TOPS.find((t) => t.id === top);
  const selectedBottom = BOTTOMS.find((b) => b.id === bottom);
  const fabA = FABRICS.find((f) => f.id === fabricA);
  const fabB = FABRICS.find((f) => f.id === fabricB);

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
    <div className="fixed inset-0 z-50 bg-black/40 md:flex md:items-center md:justify-center md:p-4">
      <div
        className="fixed inset-0 md:static md:inset-auto bg-background flex flex-col md:rounded-2xl md:shadow-2xl md:w-full md:max-w-[860px] md:max-h-[90vh]"
        style={{ height: "100dvh" }}
      >
      {/* Fixed header */}
      <header className="flex-shrink-0 px-3 pt-2 pb-1.5 md:px-5 md:pt-3 md:pb-2 border-b border-border bg-background md:rounded-t-2xl">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <span className="text-xs font-light text-muted-foreground">
            Étape {step} / 3
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 -mr-1.5 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-colors ${
                n <= step ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>
        <h3 className="mt-1 text-sm md:text-base font-light">{STEP_TITLES[step]}</h3>
      </header>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-y-auto px-3 py-2 md:px-5 md:py-3">
        {step === 1 && (
          <div className="flex flex-col h-full justify-between gap-4 pt-4 pb-6">
            <section>
              <h4 className="text-sm sm:text-base font-medium uppercase tracking-wider mb-1">
                Haut
              </h4>
              <ShapePicker options={TOPS} value={top} onChange={setTop} />
              <div className="mt-3">
                <SizeRow value={sizeTop} onChange={setSizeTop} />
              </div>
            </section>
            <section>
              <h4 className="text-sm sm:text-base font-medium uppercase tracking-wider mb-1">
                Bas
              </h4>
              <ShapePicker options={BOTTOMS} value={bottom} onChange={setBottom} />
              <div className="mt-3">
                <SizeRow value={sizeBottom} onChange={setSizeBottom} />
              </div>
            </section>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 md:space-y-6 pb-1">
            <div>
              <p className="text-[11px] font-light text-muted-foreground mb-2 uppercase tracking-wide">
                Côté A{fabA ? ` : ${fabA.name}` : ""}
              </p>
              <FabricPicker value={fabricA} onChange={setFabricASafe} disabled={fabricB} />
            </div>
            <div>
              <p className="text-[11px] font-light text-muted-foreground mb-2 uppercase tracking-wide">
                Côté B{fabB ? ` : ${fabB.name}` : ""}
              </p>
              <FabricPicker value={fabricB} onChange={setFabricBSafe} disabled={fabricA} />
            </div>
            {warning && (
              <p className="text-sm text-destructive font-light">{warning}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 md:space-y-4">
            <SwimsuitPreview
              topImg={selectedTop?.img}
              bottomImg={selectedBottom?.img}
              fabAImg={fabA?.img}
              fabBImg={fabB?.img}
            />
            <OrderRecap
              selectedTop={selectedTop}
              selectedBottom={selectedBottom}
              sizeTop={sizeTop}
              sizeBottom={sizeBottom}
              fabA={fabA}
              fabB={fabB}
              total={PRICE + SHIPPING}
            />
          </div>
        )}
      </div>


      {/* Fixed footer */}
      <footer
        className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-background md:rounded-b-2xl"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="min-h-[44px] px-4 text-sm font-light text-foreground disabled:opacity-30 hover:underline"
        >
          ← Retour
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext}
            className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-foreground px-6 text-sm font-light text-background disabled:opacity-30 transition-transform hover:scale-105"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-foreground px-6 text-sm font-light text-background transition-transform hover:scale-[1.02]"
          >
            Ajouter au panier
          </button>
        )}
      </footer>
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
    setCartOpen(true);
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
