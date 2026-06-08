// Verifies a Stripe Checkout session, marks the order as paid, sends confirmation emails.
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const NOTIFY_EMAIL = "bonjour@matea-swimwear.com";
const FROM_EMAIL = "MATEA <bonjour@matea-swimwear.com>";

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.warn("RESEND_API_KEY missing, skip email");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) console.error("Resend failed", res.status, await res.text());
}

function orderRows(items: any[]) {
  return items.map((it) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${it.topId} / ${it.bottomId}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${it.sizeTop} / ${it.sizeBottom}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">A: ${it.fabricA} · B: ${it.fabricB}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${it.price}€</td>
    </tr>`).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer_details"],
    });

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ paid: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch order
    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${session_id}&select=*`,
      { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } },
    );
    const orders = await orderRes.json();
    const order = orders[0];
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If already emailed, skip re-sending (idempotency)
    if (order.emailed_at) {
      return new Response(JSON.stringify({ paid: true, already: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update status
    await fetch(
      `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${session_id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "paid",
          shipping_address: session.customer_details?.address ?? null,
          updated_at: new Date().toISOString(),
        }),
      },
    );

    const items = order.items as any[];
    const subtotal = (order.total_amount / 100).toFixed(2);
    const SHIPPING = 6;
    const total = (order.total_amount / 100 + SHIPPING).toFixed(2);
    const rows = orderRows(items);
    const totalsHtml = `
      <table style="width:100%;font-size:14px;margin-top:16px">
        <tr><td style="padding:4px 8px;text-align:right">Maillot MATEA</td><td style="padding:4px 8px;text-align:right;width:80px">${subtotal}€</td></tr>
        <tr><td style="padding:4px 8px;text-align:right">Livraison France Standard</td><td style="padding:4px 8px;text-align:right">${SHIPPING.toFixed(2)}€</td></tr>
        <tr><td style="padding:8px;text-align:right;border-top:1px solid #111"><strong>Total</strong></td><td style="padding:8px;text-align:right;border-top:1px solid #111"><strong>${total}€</strong></td></tr>
      </table>`;
    const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
    const notes = (items as any[]).map((it, i) => it?.note ? `<p style="margin:4px 0;font-weight:300;white-space:pre-wrap">${items.length > 1 ? `<strong>Maillot ${i + 1} :</strong> ` : ""}${escapeHtml(String(it.note))}</p>` : "").join("");
    const notesHtml = notes
      ? `<div style="margin-top:20px;padding:12px 16px;background:#f7f5f2;border-radius:8px;font-size:14px;color:#111"><p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#666">Commentaires</p>${notes}</div>`
      : "";

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#111">
        <h1 style="font-weight:300;font-size:24px">Merci pour ta commande MATEA</h1>
        <p style="font-weight:300">Ton paiement a bien été reçu. Voici le récapitulatif :</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
          <thead><tr style="text-align:left">
            <th style="padding:8px;border-bottom:2px solid #111">Forme</th>
            <th style="padding:8px;border-bottom:2px solid #111">Tailles</th>
            <th style="padding:8px;border-bottom:2px solid #111">Tissus</th>
            <th style="padding:8px;border-bottom:2px solid #111;text-align:right">Prix</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${totalsHtml}
        <p style="font-weight:300;margin-top:24px">Matea te recontactera très vite pour la confection et la livraison.</p>
        <p style="font-style:italic;font-weight:300">MATEA — fait main à Marseille</p>
      </div>`;

    const notifyHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#111">
        <h1 style="font-weight:300;font-size:22px">Nouvelle commande MATEA</h1>
        <p><strong>Client :</strong> ${order.email}</p>
        <p><strong>Adresse :</strong><br>
          ${session.customer_details?.name ?? ""}<br>
          ${session.customer_details?.address?.line1 ?? ""}<br>
          ${session.customer_details?.address?.postal_code ?? ""} ${session.customer_details?.address?.city ?? ""}<br>
          ${session.customer_details?.address?.country ?? ""}
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
          <thead><tr style="text-align:left">
            <th style="padding:8px;border-bottom:2px solid #111">Forme</th>
            <th style="padding:8px;border-bottom:2px solid #111">Tailles</th>
            <th style="padding:8px;border-bottom:2px solid #111">Tissus</th>
            <th style="padding:8px;border-bottom:2px solid #111;text-align:right">Prix</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${totalsHtml}
      </div>`;


    // Atomically claim the "emailed" slot before sending to prevent races with the webhook
    const claimRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${session_id}&emailed_at=is.null`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify({ emailed_at: new Date().toISOString() }),
      },
    );
    const claimed = await claimRes.json();
    if (!Array.isArray(claimed) || claimed.length === 0) {
      // Another process (webhook) already claimed it
      return new Response(JSON.stringify({ paid: true, already: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await Promise.all([
      sendEmail(order.email, "Ta commande MATEA est confirmée", customerHtml),
      sendEmail(NOTIFY_EMAIL, `Nouvelle commande MATEA — ${order.email}`, notifyHtml),
    ]);


    return new Response(JSON.stringify({ paid: true, email: order.email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-payment error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
