import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct } from "@/lib/shop";

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
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="mb-6">
          <Link to="/boutique" className="text-xs sm:text-sm font-light text-muted-foreground hover:text-foreground">
            ← Boutique
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-secondary/40 rounded-lg">
              <img
                src={product.images[activeIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.images.map((src: string, i: number) => (
                  <button
                    key={src}
                    onClick={() => setActiveIdx(i)}
                    className={`aspect-square overflow-hidden rounded-md border transition-colors ${
                      i === activeIdx ? "border-foreground" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-light tracking-wide">{product.name}</h1>
            <p className="mt-2 text-base sm:text-lg font-light text-muted-foreground">
              à partir de {product.priceFrom}€
            </p>
            <p className="mt-6 text-sm sm:text-base font-light text-foreground/85 leading-relaxed">
              {product.description}
            </p>

            <ul className="mt-6 space-y-1.5 text-sm font-light text-muted-foreground">
              <li>• Maillot réversible — deux faces personnalisables</li>
              <li>• Cousu main à Marseille</li>
              <li>• Expédition sous une semaine maximum</li>
            </ul>

            <Link
              to="/personnaliser/$slug"
              params={{ slug: product.slug }}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm sm:text-base font-light text-background transition-transform hover:scale-[1.02] self-start"
            >
              Personnaliser →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
