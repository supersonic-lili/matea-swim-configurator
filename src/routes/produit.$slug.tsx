import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  FABRICS,
  PRICE,
  SizeRow,
  SizeGuideDialog,
  SwimsuitPreview,
  DISPLAY_FABRIC_OVERRIDES,
  getProduct,
} from "@/lib/shop";
import { useCart } from "@/hooks/useCart";


export const Route = createFileRoute("/produit/$slug")({
  head: ({ params }) => {
    const p = getProduct(params.slug);
    const title = p ? `${p.name} — MATEA` : "Produit — MATEA";
    const desc = p?.description ?? "Maillot MATEA réversible et fait main à Marseille.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.images[0] ? [{ property: "og:image", content: p.images[0] }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="text-sm font-light text-muted-foreground">Produit introuvable.</p>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="text-sm font-light text-destructive">{error.message}</p>
    </main>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();

  const [activeIdx, setActiveIdx] = useState(0);
  const [sizeTop, setSizeTop] = useState<string | null>(null);
  const [sizeBottom, setSizeBottom] = useState<string | null>(null);
  const [fabricA, setFabricA] = useState<string | null>(null);
  const [fabricB, setFabricB] = useState<string | null>(null);
  const [threadColor, setThreadColor] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const fabA = useMemo(() => FABRICS.find((f) => f.id === fabricA), [fabricA]);
  const fabB = useMemo(() => FABRICS.find((f) => f.id === fabricB), [fabricB]);
  const threadFabric = useMemo(
    () => FABRICS.find((f) => f.id === threadColor),
    [threadColor],
  );

  const missingFields = useMemo(() => {
    const m: string[] = [];
    if (!sizeTop) m.push("la taille du haut");
    if (!sizeBottom) m.push("la taille du bas");
    if (!fabricA || !fabricB) m.push("2 tissus (recto & verso)");
    if (!threadColor) m.push("la couleur des bretelles & lien");
    return m;
  }, [sizeTop, sizeBottom, fabricA, fabricB, threadColor]);

  const canAdd = missingFields.length === 0;

  const handleAdd = () => {
    if (!canAdd) {
      toast.error(`Il manque : ${missingFields.join(", ")}.`, { duration: 4000 });
      return;
    }
    addItem({
      id: crypto.randomUUID(),
      topId: product.topId,
      bottomId: product.bottomId,
      sizeTop: sizeTop!,
      sizeBottom: sizeBottom!,
      fabricA: fabricA!,
      fabricB: fabricB!,
      threadColor: threadColor!,
      price: PRICE,
      note: note.trim() || undefined,
    });
    toast.success("Ajouté au panier !", { duration: 3000 });
  };

  const PreviewBlock = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      <h3 className="text-center text-base sm:text-lg font-light mb-4">
        Choisis des tissus et visualise ton maillot
      </h3>
      <SwimsuitPreview
        bottomId={product.bottomId}
        fabAImg={fabA ? DISPLAY_FABRIC_OVERRIDES[fabA.id] ?? fabA.img : undefined}
        fabBImg={fabB ? DISPLAY_FABRIC_OVERRIDES[fabB.id] ?? fabB.img : undefined}
        threadFabricUrl={
          threadFabric
            ? DISPLAY_FABRIC_OVERRIDES[threadFabric.id] ?? threadFabric.img
            : undefined
        }
      />
      <div className="mt-6">
        <p className="text-sm font-semibold">Fait main à la commande</p>
        <p className="text-sm font-light text-muted-foreground">
          Compte une semaine de confection après le paiement
        </p>
      </div>
    </div>
  );

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        <div className="mb-6">
          <Link
            to="/boutique"
            className="text-xs sm:text-sm font-light text-muted-foreground hover:text-foreground"
          >
            ← Produits
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* LEFT — Gallery + Preview (desktop only) */}
          <div className="flex flex-col gap-10 lg:sticky lg:top-6">
            <div className="flex gap-3">
              {/* Thumbs */}
              {product.images.length > 1 && (
                <div className="flex flex-col gap-2 w-16 sm:w-20 shrink-0">
                  {product.images.map((src: string, i: number) => (
                    <button
                      key={src}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`aspect-square overflow-hidden rounded-md border transition-colors ${
                        i === activeIdx
                          ? "border-foreground"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
              {/* Main */}
              <div className="flex-1 aspect-[3/4] overflow-hidden bg-secondary/40 rounded-lg">
                <img
                  src={product.images[activeIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <PreviewBlock className="hidden lg:block" />
          </div>

          {/* RIGHT — Configurator */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
                {product.name} <span className="text-muted-foreground">— personnalisable (réversible)</span>
              </h1>
              <p className="mt-2 text-lg font-light">{product.priceFrom}€</p>
              <p className="mt-1 text-xs font-light text-muted-foreground">
                Réductions et frais de livraison calculés à l'étape du paiement
              </p>
            </div>

            <p className="text-sm sm:text-base font-light leading-relaxed text-foreground/85">
              {product.blurb}
            </p>

            <section>
              <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                <h4 className="text-sm font-medium">Taille du haut</h4>
                <SizeGuideDialog />
              </div>
              <SizeRow value={sizeTop} onChange={setSizeTop} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                <h4 className="text-sm font-medium">Taille du bas</h4>
              </div>
              <SizeRow value={sizeBottom} onChange={setSizeBottom} />
            </section>

            <section>
              <h4 className="text-sm font-medium mb-2">
                Tissus recto &amp; verso
                {(fabA || fabB) && (
                  <span className="ml-2 text-xs font-light text-muted-foreground">
                    : {[fabA?.name, fabB?.name].filter(Boolean).join(" & ")}
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
                {FABRICS.map((f) => {
                  const isA = fabricA === f.id;
                  const isB = fabricB === f.id;
                  const selected = isA || isB;
                  const order = isA ? 1 : isB ? 2 : null;
                  const handleClick = () => {
                    setWarning(null);
                    if (isA) return setFabricA(null);
                    if (isB) return setFabricB(null);
                    if (!fabricA) setFabricA(f.id);
                    else if (!fabricB) setFabricB(f.id);
                    else
                      setWarning(
                        "Tu ne peux sélectionner que 2 tissus. Déselectionnes-en un pour en changer.",
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
              {warning && (
                <p className="mt-2 text-xs text-destructive font-light">{warning}</p>
              )}
            </section>

            <section>
              <h4 className="text-sm font-medium mb-2">
                Bretelles &amp; lien
                {threadFabric && (
                  <span className="ml-2 text-xs font-light text-muted-foreground">
                    : {threadFabric.name}
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-11 gap-2">
                {FABRICS.map((f) => {
                  const selected = threadColor === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setThreadColor(f.id)}
                      aria-label={f.name}
                      title={f.name}
                      className={`relative aspect-square w-full max-w-[52px] sm:max-w-none rounded-full overflow-hidden transition-all ${
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
            </section>

            <PreviewBlock className="lg:hidden" />

            <section>
              <label
                htmlFor="product-note"
                className="text-sm font-medium block mb-1.5"
              >
                Commentaires
              </label>
              <textarea
                id="product-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Un commentaire ?"
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm font-light placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </section>

            <div className="flex flex-col items-start gap-2 mt-2">
              <button
                onClick={handleAdd}
                aria-disabled={!canAdd}
                className={`inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm sm:text-base font-light text-background transition-transform hover:scale-[1.02] ${!canAdd ? "opacity-60" : ""}`}
              >
                Ajouter au panier — {product.priceFrom}€
              </button>
              {!canAdd && (
                <p className="text-xs font-light text-muted-foreground">
                  Pour ajouter au panier, sélectionne&nbsp;: {missingFields.join(", ")}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
