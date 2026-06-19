import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/shop";
import { Button } from "@/components/ui/button";

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
        <header className="mb-8 sm:mb-12">
          <h1 className="text-xl sm:text-2xl font-light tracking-wide">Produits</h1>
          <p className="mt-2 text-sm sm:text-base font-light text-foreground/90 max-w-2xl">
            Tous nos maillots sont réversibles. Choisis ta coupe préférée et personnalise ton maillot !
          </p>
        </header>


        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
          {PRODUCTS.map((p) => (
            <div key={p.slug} className="group block scale-[0.7] origin-top">
              <Link
                to="/produit/$slug"
                params={{ slug: p.slug }}
                className="block"
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
              </Link>
              <div className="mt-3 px-1">
                <Link
                  to="/produit/$slug"
                  params={{ slug: p.slug }}
                  className="block"
                >
                  <h2 className="text-sm sm:text-base font-light">{p.name} — réversible</h2>
                </Link>
                <p className="mt-0.5 text-xs sm:text-sm font-light text-muted-foreground">
                  {p.priceFrom}€
                </p>
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="mt-3 w-full rounded-full text-xs font-light"
                >
                  <Link to="/produit/$slug" params={{ slug: p.slug }}>
                    Choisir mes tissus
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
