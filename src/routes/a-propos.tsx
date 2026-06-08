import { createFileRoute, Link } from "@tanstack/react-router";
import mateaLogo from "@/assets/matea-logo.png";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — MATEA" },
      { name: "description", content: "Atelier MATEA à Marseille — maillots de bain personnalisables et réversibles, faits main." },
      { property: "og:title", content: "À propos — MATEA" },
      { property: "og:description", content: "Atelier MATEA à Marseille — maillots de bain personnalisables et réversibles, faits main." },
    ],
  }),
  component: AProposPage,
});

function AProposPage() {
  return (
    <main className="bg-background min-h-screen">
      <header className="px-6 pt-8 pb-4 flex items-center justify-center">
        <Link to="/" aria-label="Accueil MATEA">
          <img src={mateaLogo} alt="MATEA" className="w-[160px] sm:w-[200px] h-auto" />
        </Link>
      </header>

      <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-muted">
        <img
          src="/images/apropos-photo.jpg"
          alt="Atelier MATEA"
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center">
        <h1 className="sr-only">À propos</h1>
        <p className="text-base sm:text-lg font-light leading-relaxed text-foreground/90">
          Dans mon atelier à Marseille, je confectionne à la main des maillots de bain personnalisables et réversibles, pensés pour s'adapter à vos envies et à votre style. Choisissez vos tissus, sélectionnez la forme qui vous met le plus en valeur, et créez une pièce unique qui vous ressemble. Je réalise votre maillot spécialement pour vous, avec soin et attention à chaque détail.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:bonjour@matea-swimwear.com"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm sm:text-base font-light text-background transition-transform hover:scale-105"
          >
            Contactez-moi
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-foreground px-8 py-4 text-sm sm:text-base font-light text-foreground transition-transform hover:scale-105"
          >
            Retour
          </Link>
        </div>
      </div>
    </main>
  );
}
