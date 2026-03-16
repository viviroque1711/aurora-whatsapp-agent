const IORedis = require("ioredis");

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
});

connection.on("connect", () => {
  console.log("Redis conectado para BullMQ");
});

connection.on("error", (err) => {
  console.error("Erro Redis:", err);
});

module.exports = connection;
