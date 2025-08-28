// استدعاء المكتبات اللي ثبتناها
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// إنشاء تطبيق Express جديد
const app = express();
const PORT = process.env.PORT || 5000;

// ربط قاعدة البيانات MongoDB
mongoose
  .connect(
    "mongodb+srv://rawako12:Ahmednox12@furnirodb.71yd3rl.mongodb.net/?retryWrites=true&w=majority&appName=FurniroDB",
    {}
  )
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

// تعريف شكل البيانات (Schema) في قاعدة البيانات
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  description: String,
  newPrice: Number,
  oldPrice: Number,
  is_New: Boolean,
  discount: Number
});

// إنشاء نموذج (Model) للتعامل مع البيانات دي
const Product = mongoose.model("Product", productSchema);

// تفعيل Middleware عشان التطبيق يفهم البيانات اللي بتيجي بصيغة JSON
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // رابط الفرونت
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- مسارات الـ API (API Endpoints) ---

// مسار لجلب كل المنتجات
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// مسار لإضافة أكتر من منتج جديد
app.post('/products', async (req, res) => {
  try {
    const newProducts = await Product.insertMany(req.body);
    res.status(201).json(newProducts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
