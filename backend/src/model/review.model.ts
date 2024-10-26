import mongoose, { Types } from 'mongoose';

export const SchemaReview = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: 'Product',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Reviews', SchemaReview);
