import { Category } from '../models/category';
import { CustomValidator } from "express-validator";

export const isValidCategory: CustomValidator = async (value) => {
  return Category.findOne({ _id: value }).then(category => {
    if (!category) {
      return Promise.reject('Category not found');
    }
  });
};