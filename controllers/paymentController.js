const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentService = require('../services/paymentService');
const userService = require('../services/userService');

async function createSession(req, res){
  try{
    const userId = req.session.userId;
    const { credits } = req.body;
    const successUrl = `${process.env.BASE_URL || ''}/payment-success.html`;
    const cancelUrl = `${process.env.BASE_URL || ''}/payment-cancel.html`;
    const session = await paymentService.createCheckoutSession({ userId, credits: Number(credits), successUrl, cancelUrl });
    res.json({url: session.url});
  }catch(err){
    console.error(err);
    res.status(500).json({ok:false, error: err.message});
  }
}

function success(req, res){
  res.json({ok:true});
}

// Stripe webhook
async function handleWebhook(req, res){
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try{
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  }catch(err){
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const credits = Number(metadata.credits) || 0;
    if (userId && credits > 0){
      try{
        await userService.addCredits(userId, credits, { stripeSessionId: session.id });
        console.log(`Added ${credits} credits to user ${userId}`);
      }catch(err){
        console.error('Failed to add credits', err);
      }
    }
  }
  res.json({received: true});
}

module.exports = { createSession, success, handleWebhook };
