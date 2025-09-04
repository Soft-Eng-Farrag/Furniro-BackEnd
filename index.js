require("dotenv").config(); // عشان يقرأ من ملف .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// -------- Connect to MongoDB --------
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("✅ Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ Connection error", err);
  });

// -------- Schemas & Models --------

// Products Schema
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  description: String,
  newPrice: Number,
  oldPrice: Number,
  is_New: Boolean,
  discount: Number,
  liked: Boolean, 
});
const Product = mongoose.model("Product", productSchema);

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  prodId: String,
  title: String,
  image: String,
  price: Number,
  description: String,
});
const productswishlist = mongoose.model("productswishlist", wishlistSchema, "productswishlist");

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

// 🟢 Products Endpoints
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

// 🟢 Wishlist Endpoints
app.get("/productswishlist", async (req, res) => {
  try {
    const items = await productswishlist.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/productswishlist", async (req, res) => {
  try {
    const { prodId, title, image, price, description } = req.body;

    // ✅ check if already exists
    const exist = await productswishlist.findOne({ prodId });
    if (exist) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    const newItem = new productswishlist({
      prodId,
      title,
      image,
      price,
      description,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🟢 DELETE من الـ wishlist
app.delete("/productswishlist/:id", async (req, res) => {
  try {
    const deletedItem = await productswishlist.findOneAndDelete({
      prodId: req.params.prodId,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item removed from wishlist", item: deletedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------- Server Run --------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

