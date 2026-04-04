require("dotenv").config();
require("./config/database");
require("./config/redis"); // ← بيعمل connect مرة واحدة عند بدء السيرفر

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin.route");
const projectRoutes = require("./routes/project.route");
const contactRoutes = require("./routes/message.route");
const blogRoutes = require("./routes/blog.route");
const pricingRoutes = require("./routes/pricing.route");
const httpResponse = require("./utils/httpResponse");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("trust proxy", true);

// ─── Health check (Render بيستخدمه يتأكد إن السيرفر شغال) ───────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/uploads", express.static("uploads"));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: "fail", data: "Page Not Found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: httpResponse.status.badrequest,
      message: httpResponse.message.invalidjsonformat,
      data: null,
    });
  }
  const code = err.statusCode || 500;
  // في production متبعتش stack trace للـ client
  res.status(code).json({
    status: code,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    data: null,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});