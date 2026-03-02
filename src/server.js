const express = require('express');
const dotenv = require('dotenv');
const { getTextMessage, sendWhatsAppMessage } = require('./whatsapp');
const { generateReply } = require('./openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    const incoming = getTextMessage(req.body);

    if (!incoming || !incoming.text) {
      return res.status(200).json({ status: 'ignored' });
    }

    const reply = await generateReply(incoming.text);
    await sendWhatsAppMessage(incoming.from, reply);

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Erro no processamento do webhook:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Falha ao processar webhook' });
  }
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'up' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
