const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  color: { type: String, required: false },
  storage: { type: String, required: false },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  variants: [VariantSchema],
  images: [{ type: String, required: true }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  stock: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Product", ProductSchema);
