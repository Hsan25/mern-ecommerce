import { Response, Request } from "express";
import response from "@utils/response";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  getProductsByCategory,
  updateProductById,
} from "@service/product.service";
import { z } from "zod";
import { ObjectId } from "@utils/index";
import { ProductBody, SortProduct } from "types/product";
import { schemaProduct } from "../lib/zodSchema/product.schema";
import { updateImage, uploadImage } from "../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { Types } from "mongoose";

const productController = {
  createProduct: async (
    req: Request & { fileValidationError?: string },
    res: Response,
  ) => {
    if (req.fileValidationError) {
      return response(res, 400, req.fileValidationError);
    }
    const body: ProductBody = req.body.product;
    const image = req.file;
    // upload image
    if (!image) return response(res, 400, "Image Required");
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const cldRes = await uploadImage(dataURI);
    try {
      const parse = schemaProduct.parse({
        ...body,
        stock: Number(body.stock),
        price: Number(body.price),
        ratings: Number(body.ratings),
      });
      const product = await createProduct({
        ...parse,
        description: body.description,
        images: {
          id: cldRes.public_id,
          url: cldRes.secure_url,
        },
      });

      response(res, 201, "success create new product", {
        id: product._id,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        response(
          res,
          400,
          error.issues[0].path[0] + ": " + error.issues[0].message,
        );
        return;
      }
      response(res, 400, `failed create new product`);
    }
  },
  getProducts: async (req: Request, res: Response) => {
    const { limit, page, search, sortBy, detail } = req.query;
    const LIMIT = Number(limit) || 10;
    try {
      if (LIMIT > 25) return response(res, 400, "Max Limit 25");
      if (LIMIT < 5) return response(res, 400, "min limit 5");
      const { products, totalPages } = await getProducts({
        limit: LIMIT,
        page: Number(page || 1),
        search: String(search || ""),
        detail: Boolean(detail),
        sortBy: sortBy as SortProduct,
      });
      if (!products.length) {
        if (search) return response(res, 200, "no result for " + search);
        return response(res, 404, "product not found");
      }
      response(res, 200, "success get Prodcuts", {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
        },
      });
    } catch (error) {
      console.log("error");
      return res.sendStatus(400);
    }
  },
  getProductsByCategory: async (req: Request, res: Response) => {
    const { limit, page, sortBy, search, detail } = req.query;
    const { category } = req.params;
    const LIMIT = Number(limit) || 10;
    try {
      if (LIMIT > 25) return response(res, 400, "Max Limit 25");
      if (LIMIT < 5) return response(res, 400, "min limit 5");
      const { products, totalPages } = await getProductsByCategory({
        limit: LIMIT,
        page: Number(page || 1),
        search: String(search || ""),
        detail: Boolean(detail),
        category,
        sortBy: sortBy as SortProduct,
      });
      if (!products.length) {
        if (search) return response(res, 200, "no result for " + search);
        return response(res, 404, "product not found");
      }
      response(res, 200, "success get Prodcuts", {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
        },
        category,
      });
    } catch (error) {
      if (error instanceof Error) {
        return response(res, 400, error.message);
      }
      return response(res, 400, "Failed Fetch Prodcuts");
    }
  },
  getProductById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const product = await getProductById(ObjectId(id));
      response(res, 200, "success get Prodcuts by id:" + id, {
        product,
      });
    } catch (error) {
      response(res, 404, "Prodcut not found by id:" + id, {
        product: null,
      });
    }
  },
  updateProduct: async (req: Request, res: Response) => {
    if (req.fileValidationError) {
      return response(res, 400, req.fileValidationError);
    }
    const { id } = req.params;
    const validId = new Types.ObjectId(id);
    const body: Partial<ProductBody> = req.body.product;
    try {
      const image = req.file;
      let cldRes: UploadApiResponse | null = null;
      if (image) {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + req.file?.mimetype + ";base64," + b64;
        const product = await getProductById(validId);
        cldRes = await updateImage(dataURI, product.images[0].id);
      }
      const parse = body
        ? schemaProduct.parse({
            ...body,
            stock: Number(body.stock),
            price: Number(body.price),
            ratings: Number(body.ratings),
          })
        : {};
      cldRes != null
        ? await updateProductById(validId, {
            ...parse,
            images: {
              id: cldRes.public_id,
              url: cldRes.secure_url,
            },
          })
        : await updateProductById(validId, parse);
      response(res, 200, "success update product");
    } catch (error: any) {
      console.error(error);
      response(res, 404, error.message);
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deleted = await deleteProductById(ObjectId(id));
      if (deleted) response(res, 200, `success delete product with id: ${id}`);
    } catch (error) {
      console.error(error);
      response(res, 404, `failed delete product with id: ${id}`);
    }
  },
};

export default productController;
