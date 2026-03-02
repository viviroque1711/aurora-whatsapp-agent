const axios = require('axios');

const WHATSAPP_API_BASE = 'https://graph.facebook.com/v20.0';

function getTextMessage(payload) {
  const entry = payload?.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];

  if (!message || message.type !== 'text') {
    return null;
  }

  return {
    from: message.from,
    text: message.text?.body
  };
}

async function sendWhatsAppMessage(to, text) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    throw new Error('WHATSAPP_TOKEN e WHATSAPP_PHONE_ID devem estar configuradas.');
  }

  const url = `${WHATSAPP_API_BASE}/${phoneId}/messages`;

  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

module.exports = {
  getTextMessage,
  sendWhatsAppMessage
};
