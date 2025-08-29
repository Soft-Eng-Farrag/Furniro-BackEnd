// استدعاء المكتبات اللي ثبتناها
require("dotenv").config(); // عشان يقرأ من ملف .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// إنشاء تطبيق Express جديد
const app = express();
const PORT = process.env.PORT || 5000;

// ربط قاعدة البيانات MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("✅ Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ Connection error", err);
  });

// تعريف شكل البيانات (Schema)
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  description: String,
  newPrice: Number,
  oldPrice: Number,
  is_New: Boolean,
  discount: Number,
});

// إنشاء نموذج (Model)
const Product = mongoose.model("Product", productSchema);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://furniro-backend-production-1e15.up.railway.app/products", // غيره بعدين للفرونت على Railway
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- API Endpoints ---

// GET كل المنتجات
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST إضافة منتجات
app.post("/products", async (req, res) => {
  try {
    const newProducts = await Product.insertMany(req.body);
    res.status(201).json(newProducts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
