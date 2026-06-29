import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import mateaLogo from "@/assets/matea-logo.png";
import { Testimonials } from "@/components/Testimonials";

const heroAsset = { url: "/images/editorial-7.jpg" };
const editorial5 = { url: "/images/editorial-5.jpg" };
const editorial6 = { url: "/images/editorial-6.jpg" };
const editorialBottom = { url: "/images/hero.jpg" };

export const Route = createFileRoute("/")({
  component: Index,
});

function Hero() {
  return (
    <section
      className="relative -mt-14 min-h-screen w-full flex flex-col items-center justify-center px-6 text-center pt-14"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.45)), url(${heroAsset.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative">
        <h1 className="sr-only">MATEA</h1>
        <img src={mateaLogo} alt="MATEA" className="relative w-[260px] sm:w-[320px] h-auto" />
      </div>
      <p className="mt-3 text-base sm:text-lg md:text-xl text-foreground/90 font-light">
        <span className="font-bold">maillots réversibles &amp; faits main, Marseille</span>
      </p>
      <div className="mt-16 sm:mt-24 flex items-center gap-4">
        <Link
          to="/boutique"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm sm:text-base font-light text-background transition-transform hover:scale-105"
        >
          Découvrir la boutique
        </Link>
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="w-full">
        <div className="grid grid-cols-2 gap-0.5 items-start">
          <div className="aspect-[3/4] overflow-hidden">
            <img src={editorial5.url} alt="MATEA 1" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="aspect-[3/2] overflow-hidden">
              <img src={editorial6.url} alt="MATEA 2" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/2] overflow-hidden">
              <img src={editorialBottom.url} alt="MATEA 3" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <p className="font-light italic text-center text-lg sm:text-xl text-foreground/80 mt-12 sm:mt-16 max-w-2xl mx-auto px-6">
          Chaque maillot est unique, cousu à la main, à Marseille.
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

function Footer() {
  return (
    <footer className="py-12 px-6 text-center text-sm font-light text-muted-foreground border-t border-border">
      <p className="mb-4">
        <a href="mailto:bonjour@matea-swimwear.com" className="underline">
          Contactez-moi
        </a>
      </p>
      <p className="text-base italic">MATEA — fait main à Marseille</p>
      <p className="mt-2">© {new Date().getFullYear()} MATEA</p>
    </footer>
  );
}

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Editorial />
      <Testimonials />
      <Footer />
    </main>
  );
}
