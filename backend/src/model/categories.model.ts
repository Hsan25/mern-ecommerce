import mongoose from "mongoose";
const CategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowerCase: true },
    description: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Categories", CategoriesSchema);
