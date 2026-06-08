// Stripe webhook: reliably triggers order emails on checkout.session.completed
// (and async_payment_succeeded for delayed payment methods), independent of browser redirect.
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const NOTIFY_EMAIL = "bonjour@matea-swimwear.com";
const FROM_EMAIL = "MATEA <bonjour@matea-swimwear.com>";

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.warn("RESEND_API_KEY missing, skip email");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    console.error("Resend failed", res.status, await res.text());
    return false;
  }
  return true;
}

function orderRows(items: any[]) {
  return items.map((it) => {
    const threadLine = it.threadColor
      ? `<br/><span style="color:#666">Liens/Bretelles : ${it.threadColor}</span>`
      : "";
    return `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${it.topId} / ${it.bottomId}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${it.sizeTop} / ${it.sizeBottom}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">A: ${it.fabricA} · B: ${it.fabricB}${threadLine}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${it.price}€</td>
    </tr>`;
  }).join("");
}

async function processPaidSession(stripe: Stripe, sessionId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["customer_details"],
  });

  if (session.payment_status !== "paid") {
    console.log(`[webhook] session ${sessionId} not paid yet: ${session.payment_status}`);
    return { paid: false };
  }

  // Fetch order
  const orderRes = await fetch(
    `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${sessionId}&select=*`,
    { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } },
  );
  const orders = await orderRes.json();
  const order = orders[0];
  if (!order) {
    console.error(`[webhook] order not found for session ${sessionId}`);
    return { paid: true, emailed: false, reason: "order_not_found" };
  }

  // Idempotency: if already paid+emailed, skip
  if (order.status === "paid" && order.emailed_at) {
    console.log(`[webhook] session ${sessionId} already processed`);
    return { paid: true, already: true };
  }

  // Mark paid first (idempotent update)
  await fetch(
    `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${sessionId}`,
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
      ${notesHtml}
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
      ${notesHtml}
    </div>`;


  const [customerOk, notifyOk] = await Promise.all([
    sendEmail(order.email, "Ta commande MATEA est confirmée", customerHtml),
    sendEmail(NOTIFY_EMAIL, `Nouvelle commande MATEA — ${order.email}`, notifyHtml),
  ]);

  if (customerOk && notifyOk) {
    // Mark emailed_at so we don't re-send on retries
    await fetch(
      `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${sessionId}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailed_at: new Date().toISOString() }),
      },
    );
  }

  return { paid: true, emailed: customerOk && notifyOk, email: order.email };
}

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const body = await req.text();

    let event: Stripe.Event;
    if (signature && webhookSecret) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      } catch (err) {
        console.error("[webhook] signature verification failed", err);
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
      }
    } else {
      console.warn("[webhook] no signature/secret configured — parsing unverified payload");
      event = JSON.parse(body) as Stripe.Event;
    }

    console.log(`[webhook] received ${event.type} ${event.id}`);

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const result = await processPaidSession(stripe, session.id);
        console.log(`[webhook] processed ${session.id}`, result);
        break;
      }
      default:
        console.log(`[webhook] ignoring ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[webhook] error", e);
    // Return 500 so Stripe retries
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
});
