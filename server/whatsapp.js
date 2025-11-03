const GRAPH_VERSION = 'v20.0';

function getToken() {
  return process.env.META_WHATSAPP_TOKEN || '';
}

function getPhoneNumberId(input) {
  return input || process.env.META_PHONE_NUMBER_ID || '';
}

export async function sendTextMessage({ to, body, phoneNumberId }) {
  const id = getPhoneNumberId(phoneNumberId);
  if (!id) return;
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${id}/messages`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body }
    })
  }).catch(() => {});
}

export async function markMessageRead({ messageId, phoneNumberId }) {
  const id = getPhoneNumberId(phoneNumberId);
  if (!id) return;
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${id}/messages`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    })
  }).catch(() => {});
}
