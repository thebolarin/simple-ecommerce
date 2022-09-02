import { ObjectId } from 'mongoose';
import { CategoryPayload, CategoryQueryPayload } from './../interfaces/category.interface';
import { Category } from '../models/category';

export const getAll = async (queryString: CategoryQueryPayload) => {
    try {
        let pageOptions = {
            page: queryString.page || 0,
            limit: (queryString.limit ? (queryString.limit > 100 ? 100 : queryString.limit) : 25)
        }

        let query: CategoryQueryPayload;

        if (queryString.name && queryString.name != '') query.name = queryString.name;
        if (queryString.code && queryString.code != '') query.code = queryString.code;

        const categoriesCount = await Category.countDocuments(query).exec();

        const category = await Category.find(query)
            .sort({ createdAt: -1 })
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit * 1)
            .exec();

        return {
            status: "success",
            statusCode: 200,
            message: "Categories record fetched successfully.",
            data: {
                category,
                total: categoriesCount,
                pages: Math.ceil(categoriesCount / pageOptions.limit),
                page: pageOptions.page,
                limit: pageOptions.limit
            }
        }

    } catch (err) {
        return {
            status: "error", statusCode: 500,
            message: "Invalid Request", data: err
        }
    }
}

export const create = async (payload: CategoryPayload) => {
    try {
        const { name } = payload;

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return { status: "error", statusCode: 400, message: "Category already exists" };
        }

        const category = Category.build({ name, code: `CAT-${Date.now()}` });
        await category.save();

        return {
            status: "success", statusCode: 201,
            message: "Category created successfully",
            data: category
        }

    } catch (err) {
        return {
            status: "error", statusCode: 500,
            message: "Invalid Request",
            data: err
        }
    }
}

export const getOne = async (categoryId: string) => {
    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { status: "error", statusCode: 404, message: "Category not found" };
        }

        return {
            status: "success", statusCode: 200,
            message: "Category fetched successfully",
            data: category
        };


    } catch (err) {
        return {
            status: "error", statusCode: 500,
            message: "Invalid Request",
            data: err
        }
    }
}

export const update = async (categoryId: string, payload: CategoryPayload) => {
    const { name } = payload;
    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return {
                status: "error", statusCode: 400,
                message: "Category not found"
            };
        }

        category.set({ name });
        await category.save();

        return {
            status: "success", statusCode: 200,
            message: "Category updated successfully",
            data: category
        };

    } catch (err) {
        return {
            status: "error", statusCode: 500,
            message: "Invalid Request",
            data: err
        }
    }
}

export const remove = async (categoryId: string) => {
    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return {
                status: "error", statusCode: 400,
                message: "Category not found"
            };
        }

        await category.remove();

        return {
            status: "success", statusCode: 200,
            message: "Category deleted successfully"
        };
    } catch (err) {
        return {
            status: "error", statusCode: 500,
            message: "Invalid Request",
            data: err
        }
    }
}