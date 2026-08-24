import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
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
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith("/produit/");
  const isBoutique = pathname === "/boutique";
  const notSticky = isProductPage || isBoutique;

  return (
    <>
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs font-medium tracking-wide z-40 relative">
        Code promo <span className="font-bold">MATEA15</span> : -15% de réduction sur ta commande
      </div>
      <header className={`${notSticky ? "relative" : "sticky top-0"} z-30 w-full bg-transparent bg-gradient-to-b from-background/40 to-transparent`}>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center">
            <Link to="/" aria-label="Accueil MATEA">
              <img src={mateaLogo} alt="MATEA" className="h-8 sm:h-10 w-auto object-contain" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="text-sm font-bold text-foreground hover:opacity-70 transition-opacity"
                activeProps={{ className: "text-sm font-bold text-foreground underline underline-offset-4" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 flex items-center justify-end gap-2">
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
