import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/lib/shop";

const STORAGE_KEY = "matea-cart";

let cart: CartItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

function loadFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

let initialized = false;
function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  loadFromStorage();
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      loadFromStorage();
      emit();
    }
  });
}

function subscribe(cb: () => void) {
  ensureInit();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return cart;
}
const EMPTY: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const addItem = (item: CartItem) => {
    cart = [...cart, item];
    persist();
    emit();
  };
  const removeItem = (id: string) => {
    cart = cart.filter((i) => i.id !== id);
    persist();
    emit();
  };
  const clear = () => {
    cart = [];
    persist();
    emit();
  };

  const checkout = async (email: string, promoCode: string | null) => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { items: cart, email, promoCode, origin: window.location.origin },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL Stripe manquante");
      }
    } catch (e) {
      console.error(e);
      toast.error("Le paiement n'a pas pu démarrer. Réessaie.");
      setCheckoutLoading(false);
    }
  };

  return { items, addItem, removeItem, clear, checkout, checkoutLoading };
}

/** Handles ?payment=success|cancel return from Stripe checkout. Mount once at app root. */
export function useStripeReturn() {
  const { clear } = useCart();
  useEffect(() => {
    const url = new URL(window.location.href);
    const payment = url.searchParams.get("payment");
    const sessionId = url.searchParams.get("session_id");
    if (payment === "success" && sessionId) {
      (async () => {
        try {
          const { data } = await supabase.functions.invoke("verify-payment", {
            body: { session_id: sessionId },
          });
          if (data?.paid) {
            clear();
            toast.success("Paiement confirmé — merci pour ta commande !", { duration: 6000 });
          }
        } catch (e) {
          console.error(e);
        } finally {
          url.searchParams.delete("payment");
          url.searchParams.delete("session_id");
          window.history.replaceState({}, "", url.pathname + (url.search || ""));
        }
      })();
    } else if (payment === "cancel") {
      toast("Paiement annulé.");
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
