// Creates a Stripe Checkout session for the cart and returns the redirect URL.
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CartItem {
  id: string;
  topId: string;
  bottomId: string;
  fabricA: string;
  fabricB: string;
  sizeTop: string;
  sizeBottom: string;
  threadColor?: string;
  price: number;
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const { items, email, origin, promoCode, validatePromo } = await req.json() as {
      items: CartItem[];
      email: string;
      origin: string;
      promoCode?: string | null;
      validatePromo?: string | null;
    };

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    // --- Promo code validation (called from the cart before checkout) ---
    if (validatePromo !== undefined && validatePromo !== null) {
      const code = String(validatePromo).trim().toUpperCase();
      if (!code) return json({ valid: false });
      const stripeV = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
      const list = await stripeV.promotionCodes.list({ code, active: true, limit: 1 });
      const promo = list.data[0];
      if (promo && promo.coupon?.valid) {
        return json({
          valid: true,
          code: promo.code.toUpperCase(),
          percent_off: promo.coupon.percent_off ?? null,
          amount_off: promo.coupon.amount_off ? promo.coupon.amount_off / 100 : null,
        });
      }
      return json({ valid: false });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: "Empty cart" }, 400);
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email" }, 400);
    }



    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    // Keep product names in sync with the site catalog (src/lib/shop.tsx).
    const PRODUCT_NAMES: Record<string, string> = {
      tanga: "L'ensemble tanga — réversible",
      culotte: "L'ensemble bas échancré — réversible",
      string: "L'ensemble string — réversible",
    };
    const FABRIC_NAMES: Record<string, string> = {
      lila: "Lila", violet: "Violet", kaki: "Kaki", noir: "Noir", bleu: "Bleu", "bleu-roi": "Bleu Roi",
      corail: "Corail", jaune: "Jaune", "marron-satine": "Marron Satiné",
      orange: "Orange", rose: "Rose", "rouge-satine": "Rouge Satiné", vert: "Vert",
      bee: "Bee", "black-water": "Blackwater", disco: "Disco", fire: "Fire",
      fog: "Fog", fruits: "Fruits", night: "Night", prune: "Prune", shego: "Shego", camo: "Camo",
    };
    const fabricName = (id: string) => FABRIC_NAMES[id] ?? id;
    const productName = (it: CartItem) =>
      PRODUCT_NAMES[it.bottomId] ?? `Maillot MATEA · ${it.topId}/${it.bottomId}`;

    const line_items = items.map((it) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: productName(it),
          description: `Taille haut ${it.sizeTop} · Taille bas ${it.sizeBottom} · Tissus : ${fabricName(it.fabricA)} & ${fabricName(it.fabricB)} · Bretelles & lien : ${fabricName(it.threadColor ?? "")}`,
        },
        unit_amount: Math.round(it.price * 100),
      },
      quantity: 1,
    }));

    // Handle our app-level promo codes (keep in sync with PROMO_CODES in src/lib/shop.tsx).
    const PROMO_CODES: Record<string, number> = { MATEA10: 10 };
    const normalizedPromo = (promoCode ?? "").trim().toUpperCase();
    let discounts: { coupon: string }[] | undefined;
    const percentOff = PROMO_CODES[normalizedPromo];
    if (percentOff) {
      const coupon = await stripe.coupons.create({
        percent_off: percentOff,
        duration: "once",
        name: normalizedPromo,
      });
      discounts = [{ coupon: coupon.id }];
    }


    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
      // allow_promotion_codes and discounts are mutually exclusive in Stripe Checkout.
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      shipping_address_collection: { allowed_countries: ["FR"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 490, currency: "eur" },
            display_name: "Livraison France Standard",
          },
        },
      ],
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancel`,
      metadata: {
        cart: JSON.stringify(items).slice(0, 4500),
        promo_code: normalizedPromo || "",
      },
    });


    // Persist pending order
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const total_amount = items.reduce((s, i) => s + Math.round(i.price * 100), 0);
    await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        email,
        total_amount,
        currency: "eur",
        items,
        stripe_session_id: session.id,
        status: "pending",
      }),
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
