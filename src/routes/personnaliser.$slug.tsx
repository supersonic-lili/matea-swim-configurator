import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ConfiguratorOverlay, getProduct } from "@/lib/shop";
import { useCart } from "@/hooks/useCart";

export const Route = createFileRoute("/personnaliser/$slug")({
  head: ({ params }) => {
    const p = getProduct(params.slug);
    const title = p ? `Personnaliser ${p.name} — MATEA` : "Personnaliser — MATEA";
    return {
      meta: [
        { title },
        { name: "description", content: "Personnalise ton maillot MATEA : choisis tes tailles, tes tissus et tes liens." },
        { property: "og:title", content: title },
      ],
    };
  },
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: PersonnaliserPage,
  notFoundComponent: () => (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="text-sm font-light text-muted-foreground">Modèle introuvable.</p>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="text-sm font-light text-destructive">{error.message}</p>
    </main>
  ),
});

function PersonnaliserPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug)!;
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <main className="bg-background min-h-screen">
      <ConfiguratorOverlay
        initialTop={product.topId}
        initialBottom={product.bottomId}
        lockShape
        onClose={() => navigate({ to: "/produit/$slug", params: { slug: product.slug } })}
        onAddToCart={(item) => {
          addItem(item);
          toast.success("Ajouté au panier !", { duration: 3000 });
          navigate({ to: "/boutique" });
        }}
      />
      {/* Fallback content behind overlay */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Link to="/produit/$slug" params={{ slug: product.slug }} className="text-sm font-light underline">
          ← Retour au produit
        </Link>
      </div>
    </main>
  );
}
