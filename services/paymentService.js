const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession({userId, credits, successUrl, cancelUrl}){
  const unitPriceCents = 100; // 1 credit = $1
  const amount = credits * unitPriceCents;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `${credits} credit(s) for Sfogo` },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    metadata: { userId, credits },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return session;
}

module.exports = { createCheckoutSession };
