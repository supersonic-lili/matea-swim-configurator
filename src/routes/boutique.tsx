import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/shop";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique — MATEA" },
      { name: "description", content: "Découvre les modèles de maillots réversibles MATEA, faits main à Marseille." },
      { property: "og:title", content: "Boutique — MATEA" },
      { property: "og:description", content: "Découvre les modèles de maillots réversibles MATEA, faits main à Marseille." },
    ],
  }),
  component: Boutique,
});

function Boutique() {
  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <header className="text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide">Boutique</h1>
          <p className="mt-2 text-sm sm:text-base font-light text-muted-foreground">
            Choisis ton modèle, puis personnalise-le.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              to="/produit/$slug"
              params={{ slug: p.slug }}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary/40 rounded-lg">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                {p.images[1] && (
                  <img
                    src={p.images[1]}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                )}
              </div>
              <div className="mt-3 px-1">
                <h2 className="text-sm sm:text-base font-light">{p.name}</h2>
                <p className="mt-0.5 text-xs sm:text-sm font-light text-muted-foreground">
                  à partir de {p.priceFrom}€
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
