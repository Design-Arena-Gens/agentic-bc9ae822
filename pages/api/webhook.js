import { handleIncomingMessage } from "../../server/agent";
import { sendTextMessage, markMessageRead } from "../../server/whatsapp";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const verifyToken = process.env.META_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token && mode === 'subscribe' && token === verifyToken) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      if (body.object !== 'whatsapp_business_account') {
        return res.status(200).json({ status: 'ignored' });
      }

      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const messages = value.messages || [];
          const metadata = value.metadata || {};
          const phoneNumberId = metadata.phone_number_id || process.env.META_PHONE_NUMBER_ID;

          for (const message of messages) {
            const from = message.from;
            const messageId = message.id;

            if (message.type === 'text' && message.text && message.text.body) {
              const userText = message.text.body.trim();
              const { reply } = await handleIncomingMessage(from, userText);

              if (reply) {
                await sendTextMessage({ to: from, body: reply, phoneNumberId });
              }
            } else if (message.type === 'interactive' && message.interactive) {
              const payloadText = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || '';
              const { reply } = await handleIncomingMessage(from, payloadText);
              if (reply) {
                await sendTextMessage({ to: from, body: reply, phoneNumberId });
              }
            }

            if (messageId) {
              await markMessageRead({ messageId, phoneNumberId });
            }
          }
        }
      }

      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      console.error('Webhook error', err);
      return res.status(200).json({ status: 'ok' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
