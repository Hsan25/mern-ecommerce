import shippingMethod from "@model/shippingMethod.model";
import { Types } from "mongoose";

interface ShippingMethod {
  name: string;
  price: number;
}
export const getShippingMethods = async () => {
  try {
    const docs = await shippingMethod.find({}, "type _id price");
    return docs;
  } catch (error) {
    console.log(error);
    throw new Error("Failed fetch shipping method");
  }
};
export const getShippingMethodById = async (id: Types.ObjectId) => {
  try {
    const doc = await shippingMethod.findOne({ _id: id }, "type _id price");
    return doc;
  } catch (error) {
    console.log(error);
    throw new Error("Failed fetch shipping method");
  }
};
export const createNewShippingMethod = async (data: ShippingMethod) => {
  try {
    const newShippingMethod = new shippingMethod(data);
    await newShippingMethod.save();
    return newShippingMethod;
  } catch (error) {
    console.error(error);
    throw new Error("Failed create new shipping method");
  }
};
export const updateShippingMethod = async (
  data: Partial<ShippingMethod>,
  id: Types.ObjectId,
) => {
  try {
    const doc = await shippingMethod.updateOne(
      { _id: id },
      { ...data, updatedAt: Date.now() },
    );
    return doc.modifiedCount;
  } catch (error) {
    console.error(error);
    throw new Error("Failed Update shipping method");
  }
};
export const deleteShippingMethod = async (id: Types.ObjectId) => {
  try {
    const doc = await shippingMethod.deleteOne({ _id: id });
    return doc.deletedCount;
  } catch (error) {
    console.error(error);
    throw new Error("Failed delete shipping method");
  }
};
