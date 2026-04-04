const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

client.on("error", (err) => {
  console.error("Redis error:", err.message);
});

// connect مرة واحدة عند بدء السيرفر
client.connect().catch((err) => {
  console.error("Redis failed to connect:", err.message);
});

module.exports = client;
