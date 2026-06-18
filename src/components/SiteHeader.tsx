import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import mateaLogo from "@/assets/matea-logo.png";
import { CartIcon, CartOverlay } from "@/lib/shop";
import { useCart } from "@/hooks/useCart";

const navItems = [
  { to: "/" as const, label: "Accueil" },
  { to: "/boutique" as const, label: "Boutique" },
  { to: "/a-propos" as const, label: "À propos" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, removeItem, checkout } = useCart();

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link to="/" aria-label="Accueil MATEA" className="flex items-center">
            <img src={mateaLogo} alt="MATEA" className="h-7 sm:h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="text-sm font-light text-foreground/80 hover:text-foreground transition-colors"
                activeProps={{ className: "text-sm font-light text-foreground underline underline-offset-4" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CartIcon count={items.length} onClick={() => setCartOpen(true)} />
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-background shadow-2xl p-6 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer"
              className="self-end w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary"
            >
              <X size={20} />
            </button>
            <nav className="mt-6 flex flex-col gap-5">
              {navItems.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-light text-foreground"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {cartOpen && (
        <CartOverlay
          items={items}
          onClose={() => setCartOpen(false)}
          onRemove={removeItem}
          onCheckout={checkout}
        />
      )}
    </>
  );
}
