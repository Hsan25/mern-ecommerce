import productModel from "@model/product.model";
import response from "@utils/response";
import {
  addReview,
  deleteReview,
  getReviewsByProduct,
} from "@service/review.service";
import { Request, Response } from "express";
import { ObjectId } from "@utils/index";
import { ReviewBody } from "types/review";

const ReviewController = {
  getReviewsByProduct: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page, limit } = req.query;
    const LIMIT = Number(limit) || 5;
    if (LIMIT > 10) return response(res, 400, "max limit 10");
    if (LIMIT < 1) return response(res, 400, "min limit 1");
    try {
      const { reviews, totalPage } = await getReviewsByProduct(ObjectId(id), {
        limit: LIMIT,
        page: Number(page) || 1,
      });
      response(res, 200, "success fetch reviews", {
        reviews,
        pagination: {
          totalPages: totalPage,
        },
      });
    } catch (error) {
      response(res, 400, "failed fetch reviews");
    }
  },
  addReview: async (req: Request, res: Response) => {
    const review: ReviewBody & { cartItem: string } = req.body;
    const { id } = req.params; //product id
    try {
      const product = await productModel.exists(ObjectId(id));
      if (!product)
        return response(res, 400, `product with id:${id}. NOT FOUND`);
      const doc = await addReview({
        ...review,
        product: id,
      });

      response(res, 201, "success add review", {
        id: doc._id,
      });
    } catch (error) {
      console.error(error);
      response(res, 400, "failed add review");
    }
  },
  deleteReview: async (req: Request, res: Response) => {
    const { review_id } = req.params;
    try {
      const doc = await deleteReview(ObjectId(review_id));
      response(res, 200, "success delete review");
    } catch (error: any) {
      console.error(error);
      response(res, 400, error.message || "failed delete review");
    }
  },
};

export default ReviewController;
