const { Worker } = require("bullmq");

const connection = require("./redis.connection");
const { generateReply } = require("../openai");

console.log("🚀 Message Worker iniciado");

const worker = new Worker(
  "message-processing",
  async (job) => {
    try {
      const { message } = job.data;

      console.log("📩 Processando mensagem:", message);

      const response = await generateReply(message);

      return response;

    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 10
  }
);

worker.on("completed", (job) => {
  console.log("✅ Job concluído:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("❌ Job falhou:", job?.id, err);
});

worker.on("error", (err) => {
  console.error("🚨 Worker error:", err);
});
