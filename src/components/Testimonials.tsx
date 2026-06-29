import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const REVIEWS = [
  {
    text: "Hello je voulais juste te dire que j'avais troppp aimé la qualité des maillots. J'ai passé un an au Brésil à perdre mon maillot à la moindre vague et j'ai été CHOQUÉE par la tenue de tes maillots. Alors merci beaucoup !",
    name: "Héloïse",
  },
  {
    text: "Trop contente de mon maillot ! Il est magnifique, la coupe tanga est parfaite. Hâte de le porter tout l'été.",
    name: "Laetitia",
  },
  {
    text: "Coucou ! J'ai bien reçu mon maillot. Il est trooop beau, parfaitement à ma taille, hyper confortable et c'est exactement la couleur des tissus que j'espérais ! J'ai fait ma première baignade avec et tout tient là où il faut. Je réfléchis déjà aux couleurs du prochain que je prendrais !",
    name: "Julie",
  },
  {
    text: "Merci pour le maillot !! Testé pour la première fois à la plage cet après-midi, les tissus sont canons.",
    name: "Adèle",
  },
  {
    text: "Trop contente du maillot ! La forme est parfaite pour moi, je les veux tous.",
    name: "Romane",
  },
];

export function Testimonials() {
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps" },
    [autoplay.current],
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-light tracking-wide text-foreground mb-12 sm:mb-16">
          Vos avis
        </h2>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  className="pl-6 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <article className="h-full flex flex-col rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                    <div className="flex gap-0.5 mb-5 text-foreground">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={14} className="fill-current" strokeWidth={0} />
                      ))}
                    </div>
                    <p className="font-serif text-5xl leading-none text-foreground/30 mb-2 select-none">
                      “
                    </p>
                    <p className="text-sm sm:text-base font-light leading-relaxed text-foreground/85 flex-1">
                      {r.text}
                    </p>
                    <p className="mt-6 text-sm font-medium tracking-wide text-foreground">
                      — {r.name}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Avis précédent"
            onClick={() => emblaApi?.scrollPrev()}
            className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border text-foreground/70 hover:text-foreground hover:bg-background transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Avis suivant"
            onClick={() => emblaApi?.scrollNext()}
            className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border text-foreground/70 hover:text-foreground hover:bg-background transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Aller à l'avis ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === selectedIndex ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/50",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
