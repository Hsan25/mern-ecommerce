import User from "@model/user.model";
import { UserType } from "types";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { OptionUser, UserBody } from "types/user";

export const getUsers = async (option: OptionUser) => {
  const { limit, page, search } = option;
  const skip = (page - 1) * limit;
  try {
    const searchCondition = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const docs = await User.find(searchCondition)
      .select("username email avatar role")
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments(searchCondition);
    const pages = Math.ceil(total / limit);
    return {
      users: docs,
      totalPage: pages,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};
export const getUserById = async (id: Types.ObjectId) => {
  try {
    const doc = await User.findById(id).select("username email avatar role");
    if (!doc) throw new Error("User not found");
    return doc;
  } catch (error) {
    console.log(error)
    throw new Error("User not found");
  }
};
export const getProfileUser = async (id: Types.ObjectId) => {
  try {
    const doc = await User.findById(id).select("-password -__v -refreshToken");
    if (!doc) throw new Error("User not found");
    return doc;
  } catch (error) {
    console.log(error)
    throw new Error("User not found");
  }
};
export const getUserByUsername = async (username: string) => {
  try {
    const doc = await User.findOne({ username }).select(
      "username email avatar role",
    );
    if (!doc) throw new Error("User not found");
    return doc;
  } catch (error) {
    console.log(error)
    throw new Error("User not found");
  }
};
export const register = async (body: UserBody) => {
  try {
    const userExist = await User.find({
      $or: [
        {
          email: body.email,
        },
        {
          username: body.username,
        },
      ],
    });

    if (userExist.length) {
      throw Error("username or email is already in use");
    }

    const salt = 10;
    const passwordHash = await bcrypt.hash(body.password, salt);
    const newUser = new User({
      ...body,
      password: passwordHash,
    });
    const doc = await newUser.save();
    return doc;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const deleteUserById = async (id: Types.ObjectId) => {
  try {
    const doc = await User.findOneAndDelete({ _id: id });
    if (!doc) {
      throw new Error("id not found");
    }
    return doc;
  } catch (error) {
    console.log(error);
    throw new Error("user not found");
  }
};

export const updateUserById = async (
  id: Types.ObjectId,
  body: Partial<UserType>,
) => {
  try {
    const existingUser = await User.exists({ _id: id });
    if (!existingUser) throw new Error("user not found");
    const doc = await User.updateOne(
      { _id: id },
      { ...body, updatedAt: Date.now() },
    );
    return doc.modifiedCount;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "ERROR UPDATE USER",
    );
  }
};
