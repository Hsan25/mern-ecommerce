import Product from "@model/product.model";
import { Types } from "mongoose";
import { getCategoryByName } from "./categories.service";
import { OptionProduct, ProductBody } from "types/product";
export const getProducts = async (option: OptionProduct) => {
  const { limit, page, search, sortBy } = option;
  const skip = (page - 1) * limit;
  try {
    const searchCondition = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    let sort = {};
    switch (sortBy) {
      case "priceHighToLow":
        sort = { price: -1 };
        break;
      case "priceLowToHigh":
        sort = { price: 1 };
        break;
      case "trending":
        sort = { sold_count: -1 };
        break;
      default:
        sort = {};
        break;
    }

    const products = option.detail
      ? await Product.find(searchCondition)
          .select("-__v -reviews -description -createdAt -updatedAt")
          .populate("categories", "-__v -createdAt")
          .populate("seller", "username avatar")
          .sort(sort)
          .skip(skip)
          .limit(limit)
      : await Product.find(searchCondition)
          .select("name images ratings price")
          .populate("seller", "username avatar")
          .sort(sort)
          .skip(skip)
          .limit(limit);

    const total = await Product.countDocuments(searchCondition);
    const pages = Math.ceil(total / limit);
    return {
      products,
      totalPages: pages,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Could not fetch products");
  }
};
export const getProductsByCategory = async (
  option: OptionProduct & { category: string },
) => {
  const { limit, page, sortBy, category } = option;
  const skip = (page - 1) * limit;

  const c = await getCategoryByName(category);
  if (!c) throw new Error("Category not Found");

  try {
    let sort = {};
    switch (sortBy) {
      case "priceHighToLow":
        sort = { price: -1 };
        break;
      case "priceLowToHigh":
        sort = { price: 1 };
        break;
      case "trending":
        sort = { sold_count: -1 };
        break;
      default:
        sort = {};
        break;
    }

    const products = option.detail
      ? await Product.find({ categories: c._id })
          .select("-__v -reviews -description -createdAt -updatedAt")
          .populate("categories", "-__v -createdAt")
          .populate("seller", "username avatar")
          .sort(sort)
          .skip(skip)
          .limit(limit)
      : await Product.find({ categories: c._id })
          .select("name images ratings price")
          .populate("seller", "username avatar")
          .sort(sort)
          .skip(skip)
          .limit(limit);

    const total = await Product.countDocuments({
      categories: c._id,
    });
    const pages = Math.ceil(total / limit);
    return {
      products,
      totalPages: pages,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Could not fetch products");
  }
};
export const getProductById = async (id: Types.ObjectId) => {
  try {
    const product = await Product.findById(id)
      .select("-__v -reviews")
      .populate("categories", "-__v -createdAt")
      .populate("seller", "username avatar");

    if (!product) {
      throw new Error(`Product not found with id: ${id}`);
    }
    return product;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw new Error("Could not fetch product");
  }
};
export const deleteProductById = async (id: Types.ObjectId) => {
  try {
    const product = await Product.findOneAndDelete({ _id: id });
    if (!product?._id) throw new Error(`Product with id: ${id}. NOT FOUND`);
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Could not delete product");
  }
};
export const createProduct = async (body: ProductBody) => {
  try {
    const newProduct = new Product(body);
    const product = await newProduct.save();
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Could not create product");
  }
};
export const updateProductById = async (
  id: Types.ObjectId,
  body: Partial<ProductBody>,
) => {
  try {
    const doc = await Product.findOneAndUpdate(
      { _id: id },
      { ...body, updatedAt: Date.now() },
    );
    if (!doc) throw new Error("Product not found");
    return doc;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Could not update product");
  }
};
