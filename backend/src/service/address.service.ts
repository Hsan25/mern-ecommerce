import Address from "@model/address.model";
import userModel from "@model/user.model";
import { Types } from "mongoose";
import { AddressInterface } from "types/address";

export const createAddress = async (
  user: Types.ObjectId,
  body: AddressInterface,
) => {
  try {
    const userExist = await userModel.countDocuments({ _id: user });
    if (!userExist) throw new Error("user not found");
    const address = await Address.countDocuments({ user });
    if (address >= 3) {
      throw new Error(
        "You have reached your address limit. max addresses is 3.",
      );
    }
    const newAddress = new Address(body);
    const doc = await newAddress.save();
    return doc;
  } catch (error: any) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(error.message || "Failed create address");
  }
};

export const getAllAddress = async () => {
  try {
    const docs = await Address.find().select("-__v -createdAt -updatedAt");
    return docs;
  } catch (error) {
    console.error(error);
    throw new Error("Failed fetch address");
  }
};

export const getAddressById = async (id: Types.ObjectId) => {
  try {
    const doc = await Address.findById(id).select("-__v -createdAt -updatedAt");
    return doc;
  } catch (error) {
    console.error(error);
    throw new Error("Failed fetch address");
  }
};
export const getAddressByUser = async (userId: Types.ObjectId) => {
  try {
    const doc = await Address.find({ user: userId }).select("-__v");
    return doc;
  } catch (error) {
    console.error(error);
    throw new Error("Failed fetch address");
  }
};
export const updateAddress = async (
  id: Types.ObjectId,
  body: Partial<AddressInterface>,
) => {
  try {
    const doc = await Address.updateOne(
      { _id: id },
      { ...body, updatedAt: Date.now() },
    );
    if (!doc.modifiedCount) throw new Error("Failed update address");
    return doc.modifiedCount;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed update address");
  }
};
export const deleteAddress = async (
  user: Types.ObjectId,
  id: Types.ObjectId,
) => {
  try {
    const doc = await Address.deleteOne({ _id: id });
    if (!doc.deletedCount) throw new Error("Failed delete address");
    return doc.deletedCount;
  } catch (error) {
    console.error(error);
    throw new Error("Failed delete address");
  }
};
