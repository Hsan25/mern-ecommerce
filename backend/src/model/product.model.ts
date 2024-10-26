import mongoose, { Types } from 'mongoose';
import ReviewModel from './review.model';
import { removeImage } from '@utils/removeFile';
const SchemaProduct = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    stock: {
      type: Number,
      required: true,
      default: 1,
      maxLengt: 5,
    },
    description: String,
    price: {
      type: Number,
      required: [true, 'Please Enter product Price'],
      maxLength: [8, 'Price cannot exceed 8 characters'],
    },
    categories: {
      type: [Types.ObjectId],
      ref: 'Categories',
    },
    ratings: {
      type: Number,
      default: 0,
      maxLength: 1,
    },
    images: [String],
    seller: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [
      {
        type: Types.ObjectId,
        ref: 'Reviews',
      },
    ],
    sold_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

SchemaProduct.index({ name: 1, price: 1, categories: 1 });
// on delete
SchemaProduct.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await ReviewModel.deleteMany({ product: doc._id });
    for (const image of doc.images) {
      // get the name image and delete image
      await removeImage(image.split('/')[4]);
    }
  }
});
//on update
SchemaProduct.pre('findOneAndUpdate', async function (next) {
  const update: any = this.getUpdate();
  if (update.images) {
    const docToUpdate = await this.model.findOne(this.getQuery()).exec();
    for (const image of docToUpdate.images) {
      if (!update.images.includes(image)) {
        await removeImage(image.split('/')[4]);
      }
    }
  }
  next();
});
export default mongoose.model('Product', SchemaProduct);
