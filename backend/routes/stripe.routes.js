import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Replace with your actual Stripe price IDs
const priceIds = {
  Pro: "price_1RoooG24lTC9QJi5gnfW8Ux5", // TODO: Replace with real price ID
  Premium: "price_1Rooln24lTC9QJi5Xb56pvo0", // TODO: Replace with real price ID
};

router.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;
  const priceId = priceIds[plan];
  if (!priceId) return res.status(400).json({ error: "Invalid plan" });

  try {
    // Use the origin from the request or fallback to FRONTEND_URL
    const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/plans`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
