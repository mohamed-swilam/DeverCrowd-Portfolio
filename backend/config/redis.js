const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.warn("Redis: max retries reached, giving up");
        return false;
      }
      return retries * 1000;
    },
  },
});

client.on("error", (err) => {
  console.error("Redis error:", err.message);
});

client.on("connect", () => {
  console.log("Redis connected ✓");
});

client.connect().catch((err) => {
  console.warn("Redis unavailable — running without cache:", err.message);
});

module.exports = client;