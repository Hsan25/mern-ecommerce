import Categories from '@model/categories.model';
import { Types } from 'mongoose';

export const createCategory = async (name: string) => {
  try {
    const newCategory = new Categories({ name: name });
    const isSaving = await newCategory.save();
    return isSaving;
  } catch (error) {
    console.log(error)
    throw new Error('Failed add Category');
  }
};
export const getCategories = async () => {
  try {
    const docs = await Categories.find().select('-createdAt -__v');
    return docs;
  } catch (error) {
    console.log(error)
    throw new Error('Failed get categories');
  }
};
export const getCategoryById = async (id: Types.ObjectId) => {
  try {
    const doc = await Categories.find({ _id: id }).select('-createdAt -__v');
    if (!doc) throw new Error('Failed get categories');
    return doc;
  } catch (error) {
    console.log(error)
    throw new Error('category not found');
  }
};
export const getCategoryByName = async (name: string) => {
  try {
    const doc = await Categories.findOne({ name }).select('-createdAt -__v');
    return doc;
  } catch (error) {
    console.log(error)
    throw new Error('category not found');
  }
};
export const deleteCategoryById = async (id: Types.ObjectId) => {
  try {
    const category = await Categories.deleteOne({ _id: id });
    if (category.deletedCount == 0) {
      throw new Error('category not found');
    }
    return category.deletedCount;
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed delete Category');
  }
};
