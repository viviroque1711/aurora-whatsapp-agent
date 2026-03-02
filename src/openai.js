const axios = require('axios');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function generateReply(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada.');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model,
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente útil e objetivo para atendimento via WhatsApp. Responda em português do Brasil.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content?.trim() ||
    'Desculpe, não consegui gerar uma resposta agora.';
}

module.exports = { generateReply };
