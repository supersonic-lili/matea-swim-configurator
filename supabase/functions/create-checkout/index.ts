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
  price: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { items, email, origin } = await req.json() as {
      items: CartItem[];
      email: string;
      origin: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Empty cart" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    const line_items = items.map((it) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `Maillot MATEA · ${it.topId}/${it.bottomId}`,
          description: `Haut ${it.sizeTop} · Bas ${it.sizeBottom} · A:${it.fabricA} / B:${it.fabricB}`,
        },
        unit_amount: Math.round(it.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
      shipping_address_collection: { allowed_countries: ["FR"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 600, currency: "eur" },
            display_name: "Livraison France Standard",
          },
        },
      ],
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancel`,
      metadata: {
        cart: JSON.stringify(items).slice(0, 4500),
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
