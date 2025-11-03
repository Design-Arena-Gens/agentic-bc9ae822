# WhatsApp AI Agent (Qualification & Closing)

- Next.js API webhook for WhatsApp Cloud API (Meta)
- Lead qualification flow + heuristic scoring
- Optional objection handling via OpenAI (LLM)
- Session storage via Upstash Redis (fallback in-memory)

## Endpoints
- Webhook: `/api/webhook` (GET verify, POST receive)
- Homepage: `/`

## Environment Variables
- `META_VERIFY_TOKEN` – webhook verification token (set same in Meta)
- `META_WHATSAPP_TOKEN` – WhatsApp Cloud API token
- `META_PHONE_NUMBER_ID` – Phone number ID (Meta)
- `OPENAI_API_KEY` – optional, for LLM objection handling
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` – optional
- `BOOKING_LINK` – optional booking link for closing

## Local Dev
```bash
npm install
npm run build
npm start
```

## Deploy
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-bc9ae822
```
