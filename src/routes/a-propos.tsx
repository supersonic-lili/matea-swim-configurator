import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
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


      <div className="max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center">
        <h1 className="sr-only">À propos</h1>
        <div className="text-base sm:text-lg font-light leading-relaxed text-foreground/90 text-center space-y-5">
          <p>Je m'appelle Mathilde et je vis à Marseille, au bord de la Méditerranée.</p>
          <p>Passionnée par la mer et la couture depuis des années, ici à Marseille le maillot de bain fait presque partie du quotidien. Pourtant, j'ai longtemps eu du mal à trouver des maillots dans lesquels je me sentais vraiment bien : suffisamment confortables et maintenus pour bouger et nager, tout en restant féminins et agréables à porter. J'ai donc commencé à confectionner mes propres maillots.</p>
          <p>C'est ainsi qu'est née l'idée des maillots réversibles MATEA, un seul maillot mais plusieurs possibilités. Une façon simple d'emporter moins, de varier les styles et de profiter davantage de chaque pièce. Cette approche reflète aussi une valeur qui me tient particulièrement à cœur : consommer moins mais mieux.</p>
          <p>Chaque maillot MATEA est confectionné à la main à Marseille. Je privilégie une fabrication en petites quantités et à la commande afin d'éviter la surproduction et de proposer des pièces uniques ou produites en séries limitées.</p>
          <p>À travers MATEA, j'ai voulu créer les maillots que je recherchais moi-même : des maillots confortables, féminins, pensés pour accompagner aussi bien une journée à la plage qu'une exploration sous l'eau. Au départ, je les créais pour moi. Aujourd'hui, je suis heureuse de pouvoir les partager avec toutes celles qui aiment la mer, la liberté et les belles pièces fabriquées avec soin.</p>
          <p>Bienvenue dans l'univers MATEA.</p>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:bonjour@matea-swimwear.com"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm sm:text-base font-light text-background transition-transform hover:scale-105"
          >
            Contactez-moi
          </a>
          <a
            href="https://www.instagram.com/matea.swimwear/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram MATEA"
            className="inline-flex items-center justify-center rounded-full border border-foreground w-14 h-14 text-foreground transition-transform hover:scale-105"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>

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
    </main>
  );
}
