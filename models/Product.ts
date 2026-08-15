import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: String,

    name: String,
    price: Number,
    oldPrice: Number,

    image: String,
    hoverImage: String,

    images: [String],

    category: String,
    sizes: [String],
    rating: Number,
    discount: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);