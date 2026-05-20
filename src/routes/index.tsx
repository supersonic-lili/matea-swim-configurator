import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import heroBg from "@/assets/hero-background.jpg";
import top1 from "@/assets/top-shape-1.png";
import top2 from "@/assets/top-shape-2.png";
import bottom1 from "@/assets/bottom-shape-1.png";
import bottom2 from "@/assets/bottom-shape-2.png";
import editorialMain from "@/assets/editorial-main.jpg";
import editorialSecondary1 from "@/assets/editorial-secondary-1.jpg";
import editorialSecondary2 from "@/assets/editorial-secondary-2.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const FABRICS = [
  { id: "yuzu", name: "Yuzu Yellow", color: "#F5C518" },
  { id: "brazil", name: "Brazil Green", color: "#2E8B57" },
  { id: "chili", name: "Chili Red", color: "#C0392B" },
  { id: "tutti", name: "Tutti Frutti", color: "#FF6F91" },
  { id: "ocean", name: "Ocean Blue", color: "#1A6E9E" },
  { id: "fire", name: "Fire Orange", color: "#E8610A" },
];

const TOPS = [
  { id: "top1", label: "Haut 1", img: top1 },
  { id: "top2", label: "Haut 2", img: top2 },
];
const BOTTOMS = [
  { id: "bottom1", label: "Bas 1", img: bottom1 },
  { id: "bottom2", label: "Bas 2", img: bottom2 },
];
const SIZES = ["XS", "S", "M", "L", "XL"];

const REVOLUT_URL = "https://revolut.me/PLACEHOLDER";

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
      <h1 className="text-foreground text-7xl sm:text-8xl md:text-[10rem] font-bold tracking-tight leading-none">
        MATEA
      </h1>
      <p className="font-serif-italic mt-6 text-xl sm:text-2xl md:text-3xl text-foreground/90">
        maillots réversibles &amp; faits main, Marseille
      </p>
      <button
        onClick={onOpen}
        className="mt-12 inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm sm:text-base font-medium text-background transition-transform hover:scale-105"
      >
        Crée ton maillot
      </button>
    </section>
  );
}

function Editorial() {
  return (
    <section className="py-24 sm:py-40 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          <div className="md:row-span-2">
            <img
              src={editorialMain}
              alt="Maillot MATEA"
              loading="lazy"
              className="w-full h-full object-cover aspect-[3/4] rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-6 sm:gap-10">
            <img
              src={editorialSecondary1}
              alt="Détail tissu MATEA"
              loading="lazy"
              className="w-full object-cover aspect-[4/3] rounded-sm"
            />
            <img
              src={editorialSecondary2}
              alt="MATEA à Marseille"
              loading="lazy"
              className="w-full object-cover aspect-[4/3] rounded-sm"
            />
          </div>
        </div>
        <p className="font-serif-italic text-center text-xl sm:text-2xl text-foreground/80 mt-16 sm:mt-24 max-w-2xl mx-auto">
          Chaque maillot est unique, cousu à la main à Marseille.
        </p>
      </div>
    </section>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="flex-1 flex items-center gap-2">
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${
              n <= step ? "bg-foreground" : "bg-border"
            }`}
          />
        </div>
      ))}
      <span className="ml-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
        Étape {step} / 5
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
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
      <button
        onClick={() => setStep(step - 1)}
        disabled={step === 1}
        className="text-sm font-medium text-foreground disabled:opacity-30 hover:underline"
      >
        ← Retour
      </button>
      {step < 5 && (
        <button
          onClick={() => setStep(step + 1)}
          disabled={!canNext}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background disabled:opacity-30 transition-transform hover:scale-105"
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
    <div className="grid grid-cols-2 gap-4 sm:gap-8">
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`group relative rounded-2xl border-2 p-4 sm:p-8 transition-all bg-secondary/30 ${
              selected ? "border-foreground" : "border-transparent hover:border-border"
            }`}
          >
            <img
              src={o.img}
              alt={o.label}
              className="w-full h-48 sm:h-64 object-contain"
              loading="lazy"
            />
            <p className="mt-4 text-sm font-medium">{o.label}</p>
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
      <p className="text-sm font-medium text-muted-foreground mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {SIZES.map((s) => {
          const selected = value === s;
          return (
            <button
              key={s}
              onClick={() => onChange(s)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
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
      <p className="text-sm font-medium text-muted-foreground mb-3">{label}</p>
      <div className="grid grid-cols-3 gap-3">
        {FABRICS.map((f) => {
          const selected = value === f.id;
          const isDisabled = disabled === f.id;
          return (
            <button
              key={f.id}
              onClick={() => !isDisabled && onChange(f.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                selected ? "border-foreground" : "border-transparent hover:border-border"
              } ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <span
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: f.color }}
              />
              <span className="text-[11px] font-medium text-center leading-tight">
                {f.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReversiblePreview({
  topImg,
  bottomImg,
  colorA,
  colorB,
}: {
  topImg?: string;
  bottomImg?: string;
  colorA?: string;
  colorB?: string;
}) {
  const cA = colorA ?? "#e5e5e5";
  const cB = colorB ?? "#e5e5e5";
  const Shape = ({ img }: { img: string }) => {
    const base = {
      WebkitMaskImage: `url(${img})`,
      maskImage: `url(${img})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    } as React.CSSProperties;
    return (
      <div className="relative w-32 h-32 sm:w-36 sm:h-36">
        <div
          className="absolute inset-0 transition-colors"
          style={{ ...base, backgroundColor: cA, clipPath: "polygon(0 0, 55% 0, 45% 100%, 0 100%)" }}
        />
        <div
          className="absolute inset-0 transition-colors"
          style={{ ...base, backgroundColor: cB, clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}
        />
      </div>
    );
  };
  return (
    <div className="flex justify-center items-end gap-3 py-4 rounded-2xl bg-secondary/40">
      {topImg && <Shape img={topImg} />}
      {bottomImg && <Shape img={bottomImg} />}
    </div>
  );
}

function ConfiguratorOverlay({ onClose }: { onClose: () => void }) {
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
  const colorA = FABRICS.find((f) => f.id === fabricA)?.color;
  const colorB = FABRICS.find((f) => f.id === fabricB)?.color;

  const titles: Record<number, string> = {
    1: "Choisis ton haut",
    2: "Choisis ton bas",
    3: "Choisis ta taille",
    4: "Choisis tes matières",
    5: "Récapitulatif",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full w-full flex items-start sm:items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-3xl bg-background rounded-3xl shadow-2xl p-6 sm:p-12 my-8">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-secondary hover:bg-foreground hover:text-background flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <ProgressBar step={step} />
          <h3 className="text-2xl sm:text-3xl font-semibold mb-8 pr-12">{titles[step]}</h3>

          {step === 1 && <ShapePicker options={TOPS} value={top} onChange={setTop} />}
          {step === 2 && (
            <ShapePicker options={BOTTOMS} value={bottom} onChange={setBottom} />
          )}
          {step === 3 && (
            <div className="space-y-8">
              <SizeRow label="Haut" value={sizeTop} onChange={setSizeTop} />
              <SizeRow label="Bas" value={sizeBottom} onChange={setSizeBottom} />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-8">
              <ReversiblePreview
                topImg={selectedTop?.img}
                bottomImg={selectedBottom?.img}
                colorA={colorA}
                colorB={colorB}
              />
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
                <p className="text-sm text-destructive font-medium">{warning}</p>
              )}
            </div>
          )}
          {step === 5 && (
            <div className="space-y-8">
              <div className="rounded-2xl bg-secondary/50 p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center gap-2">
                    {selectedTop && (
                      <img
                        src={selectedTop.img}
                        alt={selectedTop.label}
                        className="h-32 object-contain"
                      />
                    )}
                    {selectedBottom && (
                      <img
                        src={selectedBottom.img}
                        alt={selectedBottom.label}
                        className="h-32 object-contain"
                      />
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taille haut</span>
                      <span className="font-medium">{sizeTop ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taille bas</span>
                      <span className="font-medium">{sizeBottom ?? "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Côté A</span>
                      <span
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: colorA }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Côté B</span>
                      <span
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: colorB }}
                      />
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between text-lg">
                      <span className="font-medium">Prix</span>
                      <span className="font-bold">85€</span>
                    </div>
                  </div>
                </div>
              </div>
              <a
                href={REVOLUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-full bg-foreground px-8 py-5 text-base font-medium text-background transition-transform hover:scale-[1.02]"
              >
                Commander
              </a>
            </div>
          )}

          {step < 5 && <StepNav step={step} setStep={setStep} canNext={canNext} />}
          {step === 5 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-medium text-foreground hover:underline"
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

function Footer() {
  return (
    <footer className="py-12 px-6 text-center text-sm text-muted-foreground border-t border-border">
      <p className="font-serif-italic text-base">
        MATEA — fait main à Marseille
      </p>
      <p className="mt-2">© {new Date().getFullYear()} MATEA</p>
    </footer>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <main className="bg-background text-foreground">
      <Hero onOpen={() => setOpen(true)} />
      <Editorial />
      <Footer />
      {open && <ConfiguratorOverlay onClose={() => setOpen(false)} />}
    </main>
  );
}
