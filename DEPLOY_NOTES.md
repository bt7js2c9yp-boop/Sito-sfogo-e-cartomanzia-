# Minimal notes for deployment

- Create a MongoDB instance (MongoDB Atlas or local) and set MONGODB_URI.
- Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in env.
- Set BASE_URL to the public URL (for Stripe success/cancel URLs).
- Run npm install && npm start

Webhook: configure Stripe to send webhooks to https://<your-domain>/webhook and set the webhook signing secret in STRIPE_WEBHOOK_SECRET.
