import { CartItem } from "@model/cart.model";
import productModel from "@model/product.model";
import Product from "@model/product.model";
import Review from "@model/review.model";
import { ObjectId } from "@utils/index";
import { Types } from "mongoose";
import { ReviewBody } from "types/review";

export const addReview = async (body: ReviewBody & { cartItem: string }) => {
  try {
    // add review
    const doc = new Review(body);
    const newReview = await doc.save();

    // update product review
    await productModel.updateOne(
      { _id: ObjectId(body.product) },
      { $push: { reviews: doc._id } },
    );

    // update status isReviewed
    await CartItem.updateOne({ _id: body.cartItem }, { isReviewed: true });

    return newReview;
  } catch (error) {
    console.error(error);

    throw new Error("Failed add reviews");
  }
};
// by product id
export const getReviewsByProduct = async (
  id: Types.ObjectId,
  option: { limit: number; page: number },
) => {
  const { limit, page } = option;
  const skip = (page - 1) * limit;
  try {
    const reviews = await Review.find({ product: id })
      .select("-__v ")
      .populate("user", "username avatar")
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ product: id });
    const totalPage = Math.ceil(total / limit);
    return {
      reviews,
      totalPage,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed fetch Reviews");
  }
};

export const addReviewToProduct = async (
  productId: Types.ObjectId,
  review: Types.ObjectId,
) => {
  try {
    await Product.updateOne({ _id: productId }, { $push: { reviews: review } });
  } catch (error) {
    console.error(error);
    throw new Error("failed add reviews  ");
  }
};
export const deleteReview = async (id: Types.ObjectId) => {
  try {
    const result = await Review.deleteOne({ _id: id });
    if (!result.deletedCount) throw new Error("Comment not found");
    return result.deletedCount;
  } catch (error) {
    console.error(error);
    throw new Error("Comment not found");
  }
};
