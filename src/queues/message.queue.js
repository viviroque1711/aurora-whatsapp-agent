const { Queue } = require("bullmq");

const connection = require("./redis.connection");

const messageQueue = new Queue("message-processing", {
  connection
});

module.exports = messageQueue;
