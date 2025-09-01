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

// -------- Schemas & Models --------

// Schema للـ Products
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
const Product = mongoose.model("Product", productSchema);

// Schema للـ Wishlist
const wishlistSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);

// -------- Middleware --------
app.use(express.json());
app.use(
  cors({
    origin: "*", // غيره بعدين للفرونت على Railway
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -------- API Endpoints --------

// Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const newProducts = await Product.insertMany(req.body);
    res.status(201).json(newProducts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Wishlist
app.get("/wishlist", async (req, res) => {
  try {
    const items = await Wishlist.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/wishlist", async (req, res) => {
  try {
    const newItem = new Wishlist(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// -------- Server Run --------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

