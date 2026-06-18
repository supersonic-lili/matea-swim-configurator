import { useEffect, useState } from "react";
import { X, ShoppingBag, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FabricSwimsuit,
  TriangleTop,
  TangaBottom,
  CulotteBottom,
} from "@/components/SwimsuitDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// Bundled fabric swatches
import fabBleu from "@/assets/fabrics-bundled/bleu.jpg";
import fabCorail from "@/assets/fabrics-bundled/corail.jpg";
import fabJaune from "@/assets/fabrics-bundled/jaune.jpg";
import fabMarron from "@/assets/fabrics-bundled/marron-satine.jpg";
import fabNoir from "@/assets/fabrics-bundled/noir.jpg";
import fabOrange from "@/assets/fabrics-bundled/orange.jpg";
import fabRose from "@/assets/fabrics-bundled/rose.jpg";
import fabRouge from "@/assets/fabrics-bundled/rouge-satine.jpg";
import fabVert from "@/assets/fabrics-bundled/vert.jpg";
import fabBee from "@/assets/fabrics-bundled/bee.jpg";
import fabBlackWater from "@/assets/fabrics-bundled/black-water.jpg";
import fabDisco from "@/assets/fabrics-bundled/disco.jpg";
import fabFire from "@/assets/fabrics-bundled/fire.jpg";
import fabFog from "@/assets/fabrics-bundled/fog.jpg";
import fabFruits from "@/assets/fabrics-bundled/fruits.jpg";
import fabNight from "@/assets/fabrics-bundled/night.jpg";
import fabPrune from "@/assets/fabrics-bundled/prune.jpg";
import fabShego from "@/assets/fabrics-bundled/shego.jpg";
import fabLila from "@/assets/fabrics-bundled/lila.jpg";
import fabViolet from "@/assets/fabrics-bundled/violet.jpg";
import fabKaki from "@/assets/fabrics-bundled/kaki.jpg";
// Display textures
import dispBleu from "@/assets/fabrics-display/bleu.jpg";
import dispCorail from "@/assets/fabrics-display/corail.jpg";
import dispJaune from "@/assets/fabrics-display/jaune.jpg";
import dispKaki from "@/assets/fabrics-display/kaki.jpg";
import dispLila from "@/assets/fabrics-display/lila.jpg";
import dispOrange from "@/assets/fabrics-display/orange.jpg";
import dispRose from "@/assets/fabrics-display/rose.jpg";
import dispRouge from "@/assets/fabrics-display/rouge.jpg";
import dispVert from "@/assets/fabrics-display/vert.jpg";
import dispViolet from "@/assets/fabrics-display/violet.jpg";

// Product images (bundled for production)
import prodBasEch0 from "@/assets/products-bundled/bas-echancre-hero.png";
import prodBasEch1 from "@/assets/products-bundled/bas-echancre-1.jpg";
import prodBasEch2 from "@/assets/products-bundled/bas-echancre-2.jpg";
import prodBasEch3 from "@/assets/products-bundled/bas-echancre-3.jpg";
import prodTanga1 from "@/assets/products-bundled/tanga-1.jpg";
import prodTanga2 from "@/assets/products-bundled/tanga-2.jpg";
import prodTanga3 from "@/assets/products-bundled/tanga-3.jpg";

export const DISPLAY_FABRIC_OVERRIDES: Record<string, string> = {
  bleu: dispBleu,
  corail: dispCorail,
  jaune: dispJaune,
  kaki: dispKaki,
  lila: dispLila,
  orange: dispOrange,
  rose: dispRose,
  "rouge-satine": dispRouge,
  vert: dispVert,
  violet: dispViolet,
};

export const FABRICS = [
  { id: "lila", name: "Lila", img: fabLila },
  { id: "violet", name: "Violet", img: fabViolet },
  { id: "kaki", name: "Kaki", img: fabKaki },
  { id: "noir", name: "Noir", img: fabNoir },
  { id: "bleu", name: "Bleu", img: fabBleu },
  { id: "corail", name: "Corail", img: fabCorail },
  { id: "jaune", name: "Jaune", img: fabJaune },
  { id: "marron-satine", name: "Marron Satiné", img: fabMarron },
  { id: "orange", name: "Orange", img: fabOrange },
  { id: "rose", name: "Rose", img: fabRose },
  { id: "rouge-satine", name: "Rouge Satiné", img: fabRouge },
  { id: "vert", name: "Vert", img: fabVert },
  { id: "bee", name: "Bee", img: fabBee },
  { id: "black-water", name: "Blackwater", img: fabBlackWater },
  { id: "disco", name: "Disco", img: fabDisco },
  { id: "fire", name: "Fire", img: fabFire },
  { id: "fog", name: "Fog", img: fabFog },
  { id: "fruits", name: "Fruits", img: fabFruits },
  { id: "night", name: "Night", img: fabNight },
  { id: "prune", name: "Prune", img: fabPrune },
  { id: "shego", name: "Shego", img: fabShego },
];

export const TOPS = [
  { id: "triangle", label: "Le Triangle", kind: "triangle" as const },
];
export const BOTTOMS = [
  { id: "tanga", label: "Le tanga", kind: "tanga" as const },
  { id: "culotte", label: "Le bas échancré", kind: "culotte" as const },
];
export const SIZES = ["XS", "S", "M", "L", "XL"];

export const PRICE = 89;
export const SHIPPING = 6;

export type CartItem = {
  id: string;
  topId: string;
  bottomId: string;
  sizeTop: string;
  sizeBottom: string;
  fabricA: string;
  fabricB: string;
  threadColor: string;
  price: number;
  note?: string;
};

export type Product = {
  slug: string;
  name: string;
  priceFrom: number;
  topId: string;
  bottomId: string;
  images: string[];
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "tanga",
    name: "L'ensemble tanga",
    priceFrom: PRICE,
    topId: "triangle",
    bottomId: "tanga",
    images: [prodTanga1, prodTanga2, prodTanga3],
    description:
      "Le tanga MATEA, fin et confortable, à porter avec le triangle. Réversible et fait main à Marseille — choisis tes tissus et tes liens.",
  },
  {
    slug: "bas-echancre",
    name: "L'ensemble bas échancré",
    priceFrom: PRICE,
    topId: "triangle",
    bottomId: "culotte",
    images: [prodBasEch0, prodBasEch1, prodBasEch3, prodBasEch2],
    description:
      "Un bas échancré et flatteur, associé au triangle MATEA. Réversible et fait main à Marseille — personnalise les deux faces selon ton style.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

// ---------- Shared sub-components ----------

export function CartIcon({ count, onClick }: { count: number; onClick: () => void }) {
  // Avoid SSR hydration mismatch — only render badge after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <button
      onClick={onClick}
      aria-label="Panier"
      className="relative w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background flex items-center justify-center transition-colors shadow-sm"
    >
      <ShoppingBag size={20} className="text-foreground" strokeWidth={1.5} />
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-foreground text-background text-[11px] font-medium flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function ShapePicker({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; kind: "triangle" | "tanga" | "culotte" }[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => {
        const selected = value === o.id;
        const Shape =
          o.kind === "triangle" ? TriangleTop : o.kind === "tanga" ? TangaBottom : CulotteBottom;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`group relative rounded-lg border-2 px-3 pt-2 pb-4 transition-all bg-secondary/30 min-h-[44px] ${
              selected ? "border-foreground" : "border-transparent hover:border-border"
            }`}
          >
            <div className="w-full flex items-center justify-center">
              <div className="w-1/2 max-w-[120px] md:max-w-[88px]">
                <Shape patternId={`pick-${o.id}`} />
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm font-light leading-tight">{o.label}</p>
          </button>
        );
      })}
    </div>
  );
}

export function SizeRow({
  value,
  onChange,
  compact,
}: {
  value: string | null;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex gap-2", compact ? "flex-nowrap" : "flex-wrap")}>
      {SIZES.map((s) => {
        const selected = value === s;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={cn(
              "rounded-full border transition-all",
              compact
                ? "min-w-[36px] min-h-[36px] px-2 text-xs"
                : "min-w-[44px] min-h-[44px] px-4 text-sm",
              selected
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground",
            )}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

export function SizeGuideDialog() {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-light text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          <Ruler size={14} strokeWidth={1.5} />
          Guide des tailles
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center tracking-wider">GUIDE DES TAILLES</DialogTitle>
          <DialogDescription className="text-center italic">
            N'hésite pas à m'écrire si tu as un doute !
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <section>
            <h4 className="text-center font-medium mb-2">Haut</h4>
            <table className="w-full border-collapse text-sm text-center">
              <tbody>
                <tr>
                  <th className="border border-foreground/70 px-2 py-2 font-light">Taille</th>
                  {["XS", "S", "M", "L", "XL"].map((s) => (
                    <th key={s} className="border border-foreground/70 px-2 py-2 font-light">{s}</th>
                  ))}
                </tr>
                <tr>
                  <th className="border border-foreground/70 px-2 py-2 font-light">Bonnet</th>
                  {["A", "B-C", "C-D", "D-E", "F-G"].map((b) => (
                    <td key={b} className="border border-foreground/70 px-2 py-2 font-light">{b}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
          <section>
            <h4 className="text-center font-medium mb-2">Bas</h4>
            <table className="w-full border-collapse text-sm text-center">
              <tbody>
                <tr>
                  <th className="border border-foreground/70 px-2 py-2 font-light">Taille</th>
                  {["XS", "S", "M", "L", "XL"].map((s) => (
                    <th key={s} className="border border-foreground/70 px-2 py-2 font-light">{s}</th>
                  ))}
                </tr>
                <tr>
                  <th className="border border-foreground/70 px-2 py-2 font-light leading-tight">Tour de hanches (cm)</th>
                  {["81-86", "86-91", "91-96", "96-101", "101-106"].map((h) => (
                    <td key={h} className="border border-foreground/70 px-2 py-2 font-light whitespace-nowrap">{h}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SwimsuitPreview({
  bottomId,
  fabAImg,
  fabBImg,
  threadFabricUrl,
}: {
  bottomId?: string;
  fabAImg?: string;
  fabBImg?: string;
  threadFabricUrl?: string;
}) {
  const Side = ({ fab, label, uid }: { fab?: string; label: string; uid: string }) => (
    <div className="flex-1 flex flex-col items-center gap-3">
      <div className="w-full bg-white">
        <FabricSwimsuit bottomId={bottomId} fabricUrl={fab} threadFabricUrl={threadFabricUrl} uid={uid} />
      </div>
      <span className="text-[11px] font-light text-foreground uppercase tracking-[0.15em]">{label}</span>
    </div>
  );
  return (
    <div className="flex gap-4 mx-auto max-w-xs">
      <Side fab={fabAImg} label="RECTO" uid="a" />
      <Side fab={fabBImg} label="VERSO" uid="b" />
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
  threadFabric,
  note,
  onNoteChange,
}: {
  selectedTop?: { label: string };
  selectedBottom?: { label: string };
  sizeTop: string | null;
  sizeBottom: string | null;
  fabA?: { name: string; img: string };
  fabB?: { name: string; img: string };
  threadFabric?: { name: string; img: string };
  note: string;
  onNoteChange: (v: string) => void;
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
    <div className="space-y-3">
      <div className="rounded-xl bg-secondary/50 p-4 space-y-2">
        <Row label="Haut" value={`${selectedTop?.label ?? "—"}, taille ${sizeTop ?? "—"}`} />
        <Row label="Bas" value={`${selectedBottom?.label ?? "—"}, taille ${sizeBottom ?? "—"}`} />
        <Row label="RECTO" value={<FabricLine f={fabA} />} />
        <Row label="VERSO" value={<FabricLine f={fabB} />} />
        <Row label="Liens/Bretelles" value={<FabricLine f={threadFabric} />} />
      </div>
      <p className="text-xs text-muted-foreground font-light">
        Les commandes sont préparées et expédiées sous une semaine maximum après la validation du paiement.
        <br />
        Réductions et frais de livraison calculés à l'étape du paiement
      </p>
      <div className="space-y-1.5">
        <label htmlFor="recap-note" className="text-sm font-medium uppercase tracking-wider">
          Commentaires
        </label>
        <textarea
          id="recap-note"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Un commentaire ?"
          rows={3}
          className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm font-light placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </div>
    </div>
  );
}

// ---------- Configurator ----------

export function ConfiguratorOverlay({
  onClose,
  onAddToCart,
  initialTop,
  initialBottom,
  lockShape = false,
}: {
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  initialTop?: string;
  initialBottom?: string;
  lockShape?: boolean;
}) {
  const initStep = lockShape ? 2 : 1;
  const totalSteps = lockShape ? 2 : 3;
  const [step, setStep] = useState(initStep);
  const [top, setTop] = useState<string | null>(initialTop ?? TOPS[0]?.id ?? null);
  const [bottom, setBottom] = useState<string | null>(initialBottom ?? null);
  const [sizeTop, setSizeTop] = useState<string | null>(null);
  const [sizeBottom, setSizeBottom] = useState<string | null>(null);
  const [fabricA, setFabricA] = useState<string | null>(null);
  const [fabricB, setFabricB] = useState<string | null>(null);
  const [threadColor, setThreadColor] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [note, setNote] = useState("");

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

  // Step 1 needs sizes (when not locked); step 2 needs sizes + fabrics + thread
  const canNext =
    (step === 1 && !!top && !!bottom && !!sizeTop && !!sizeBottom) ||
    (step === 2 && !!sizeTop && !!sizeBottom && !!fabricA && !!fabricB && !!threadColor);

  const selectedTop = TOPS.find((t) => t.id === top);
  const selectedBottom = BOTTOMS.find((b) => b.id === bottom);
  const fabA = FABRICS.find((f) => f.id === fabricA);
  const fabB = FABRICS.find((f) => f.id === fabricB);
  const threadFabric = FABRICS.find((f) => f.id === threadColor);

  const displayedStep = lockShape ? step - 1 : step;
  const totalDisplayed = totalSteps;
  const isFinalStep = step === 3;
  const isFabricStep = step === 2;

  const stepTitles: Record<number, string> = {
    1: "A toi de concevoir ton maillot !",
    2: lockShape
      ? "Choisis tes tailles et tissus"
      : "Choisis les 2 tissus de ton maillot réversible",
    3: "Récapitulatif",
  };

  const handleAddToCart = () => {
    if (!top || !bottom || !sizeTop || !sizeBottom || !fabricA || !fabricB || !threadColor) return;
    onAddToCart({
      id: crypto.randomUUID(),
      topId: top,
      bottomId: bottom,
      sizeTop,
      sizeBottom,
      fabricA,
      fabricB,
      threadColor,
      price: PRICE,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 md:flex md:items-center md:justify-center md:p-4">
      <div
        className="fixed inset-0 md:static md:inset-auto bg-background flex flex-col md:rounded-2xl md:shadow-2xl md:w-full md:max-w-[860px] md:max-h-[90vh]"
        style={{ height: "100dvh" }}
      >
        <header className="flex-shrink-0 px-3 pt-2 pb-1.5 md:px-5 md:pt-3 md:pb-2 border-b border-border bg-background md:rounded-t-2xl">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-xs font-light text-muted-foreground">
              Étape {displayedStep} / {totalDisplayed}
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
            {Array.from({ length: totalDisplayed }).map((_, idx) => {
              const n = idx + 1;
              return (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    n <= displayedStep ? "bg-foreground" : "bg-border"
                  }`}
                />
              );
            })}
          </div>
          <h3 className="mt-1 text-sm md:text-base font-light">{stepTitles[step]}</h3>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-2 md:px-5 md:py-3">
          {step === 1 && !lockShape && (
            <div className="flex flex-col h-full justify-between gap-4 pt-4 pb-6">
              <section>
                <h4 className="text-sm sm:text-base font-medium uppercase tracking-wider mb-1">
                  Choisis ton haut
                </h4>
                <ShapePicker options={TOPS} value={top} onChange={setTop} />
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <SizeRow value={sizeTop} onChange={setSizeTop} />
                  <SizeGuideDialog />
                </div>
              </section>
              <section>
                <h4 className="text-sm sm:text-base font-medium uppercase tracking-wider mb-1">
                  Choisis ton bas
                </h4>
                <ShapePicker options={BOTTOMS} value={bottom} onChange={setBottom} />
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <SizeRow value={sizeBottom} onChange={setSizeBottom} />
                  <SizeGuideDialog />
                </div>
              </section>
            </div>
          )}

          {isFabricStep && (
            <div className="space-y-4 md:space-y-6 pb-1">
              {lockShape && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <section>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2">
                      Taille du haut — {selectedTop?.label}
                    </h4>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <SizeRow value={sizeTop} onChange={setSizeTop} />
                      <SizeGuideDialog />
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-medium uppercase tracking-wider mb-2">
                      Taille du bas — {selectedBottom?.label}
                    </h4>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <SizeRow value={sizeBottom} onChange={setSizeBottom} />
                      <SizeGuideDialog />
                    </div>
                  </section>
                </div>
              )}
              <div>
                <p className="text-[11px] font-light text-muted-foreground mb-2 uppercase tracking-wide">
                  Tissus sélectionnés{" "}
                  {fabA || fabB
                    ? `: ${[fabA?.name, fabB?.name].filter(Boolean).join(" & ")}`
                    : ""}
                </p>
                <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
                  {FABRICS.map((f) => {
                    const isA = fabricA === f.id;
                    const isB = fabricB === f.id;
                    const selected = isA || isB;
                    const order = isA ? 1 : isB ? 2 : null;
                    const handleClick = () => {
                      setWarning(null);
                      if (isA) {
                        setFabricA(null);
                        return;
                      }
                      if (isB) {
                        setFabricB(null);
                        return;
                      }
                      if (!fabricA) setFabricA(f.id);
                      else if (!fabricB) setFabricB(f.id);
                      else
                        setWarning(
                          "Tu ne peux sélectionner que 2 tissus. Déselectionnes-en un pour en changer."
                        );
                    };
                    return (
                      <button
                        key={f.id}
                        onClick={handleClick}
                        aria-label={f.name}
                        title={f.name}
                        className={`relative aspect-square w-full rounded-full overflow-hidden transition-all ${
                          selected
                            ? "ring-2 ring-background ring-offset-2 ring-offset-foreground shadow-md"
                            : "hover:opacity-90"
                        }`}
                      >
                        <img
                          src={f.img}
                          alt={f.name}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-full"
                        />
                        {order && (
                          <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center">
                            {order}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {warning && <p className="text-sm text-destructive font-light">{warning}</p>}

              <div>
                <p className="text-[11px] font-light text-muted-foreground mb-2 uppercase tracking-wide">
                  Liens/Bretelles{threadFabric ? ` : ${threadFabric.name}` : ""}
                </p>
                <div className="grid grid-cols-9 md:grid-cols-[repeat(18,minmax(0,1fr))] gap-1.5">
                  {FABRICS.map((f) => {
                    const selected = threadColor === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setThreadColor(f.id)}
                        aria-label={f.name}
                        title={f.name}
                        className={`relative aspect-square w-full rounded-full overflow-hidden transition-all ${
                          selected
                            ? "ring-2 ring-background ring-offset-2 ring-offset-foreground shadow-md"
                            : "hover:opacity-90"
                        }`}
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
              </div>
            </div>
          )}

          {isFinalStep && (
            <div className="space-y-3 md:space-y-4">
              <SwimsuitPreview
                bottomId={selectedBottom?.id}
                fabAImg={fabA ? DISPLAY_FABRIC_OVERRIDES[fabA.id] ?? fabA.img : undefined}
                fabBImg={fabB ? DISPLAY_FABRIC_OVERRIDES[fabB.id] ?? fabB.img : undefined}
                threadFabricUrl={
                  threadFabric ? DISPLAY_FABRIC_OVERRIDES[threadFabric.id] ?? threadFabric.img : undefined
                }
              />
              <OrderRecap
                selectedTop={selectedTop}
                selectedBottom={selectedBottom}
                sizeTop={sizeTop}
                sizeBottom={sizeBottom}
                fabA={fabA}
                fabB={fabB}
                threadFabric={threadFabric}
                note={note}
                onNoteChange={setNote}
              />
            </div>
          )}
        </div>

        <footer
          className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-background md:rounded-b-2xl"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        >
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === initStep}
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
              {step === 2 ? "Voir mon maillot →" : "Suivant →"}
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

// ---------- Cart Overlay ----------

export function CartOverlay({
  items,
  onClose,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onCheckout: (email: string, promoCode: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);

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
  const discount = promoApplied === "MATEA10" ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "MATEA10") {
      setPromoApplied(code);
      setPromoError(false);
    } else {
      setPromoApplied(null);
      setPromoError(true);
    }
  };

  const handleClick = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    onCheckout(email.trim(), promoApplied);
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
                  const product = PRODUCTS.find(
                    (p) => p.topId === item.topId && p.bottomId === item.bottomId,
                  );
                  const a = FABRICS.find((f) => f.id === item.fabricA);
                  const bc = FABRICS.find((f) => f.id === item.fabricB);
                  const tc = FABRICS.find((f) => f.id === item.threadColor);
                  return (
                    <div key={item.id} className="relative p-4 rounded-xl bg-secondary/40">
                      <button
                        onClick={() => onRemove(item.id)}
                        className="absolute top-3 right-3 text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Retirer
                      </button>
                      <div className="space-y-1.5 text-sm font-light pr-16">
                        <p className="text-base font-medium">{product?.name ?? "Maillot MATEA"}</p>
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Taille du haut</span>
                          <span>{item.sizeTop}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Taille du bas</span>
                          <span>{item.sizeBottom}</span>
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                          <span className="text-muted-foreground">Tissus</span>
                          <span className="inline-flex items-center gap-2 flex-wrap justify-end">
                            {a && (
                              <span className="inline-flex items-center gap-1.5">
                                <img src={a.img} alt={a.name} className="w-5 h-5 rounded object-cover" />
                                {a.name}
                              </span>
                            )}
                            {a && bc && <span className="text-muted-foreground">&</span>}
                            {bc && (
                              <span className="inline-flex items-center gap-1.5">
                                <img src={bc.img} alt={bc.name} className="w-5 h-5 rounded object-cover" />
                                {bc.name}
                              </span>
                            )}
                            {!a && !bc && <span>—</span>}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                          <span className="text-muted-foreground">Bretelles &amp; lien</span>
                          <span className="inline-flex items-center gap-2">
                            {tc && <img src={tc.img} alt={tc.name} className="w-5 h-5 rounded object-cover" />}
                            {tc?.name ?? "—"}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3 pt-1.5 border-t border-border">
                          <span className="text-muted-foreground">Prix</span>
                          <span>{item.price}€</span>
                        </div>
                        {item.note && (
                          <div className="pt-1.5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Commentaires</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{item.note}</p>
                          </div>
                        )}
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
                <div className="py-1">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        if (promoError) setPromoError(false);
                      }}
                      placeholder="Code promo"
                      className="flex-1 px-3 py-2 rounded-full border border-border bg-background text-sm font-light focus:border-foreground outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-4 py-2 rounded-full border border-border text-sm font-light hover:bg-secondary transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between mt-1.5">
                      <span className="text-muted-foreground">Réduction ({promoApplied})</span>
                      <span>-{discount}€</span>
                    </div>
                  )}
                  {promoError && (
                    <p className="mt-1.5 text-xs text-destructive font-light">Code promo invalide.</p>
                  )}
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
