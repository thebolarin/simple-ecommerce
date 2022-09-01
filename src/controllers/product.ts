import { isValidCategory } from './../util/modelValidator';
import { ResMsg, BadRequestError, resultResMsg } from './../util/index';
import { create, getAll, getOne, update, remove, generateUploadUrl } from './../services/product';
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

export const fetchProducts = async (req: Request, res: Response) => {
    try {
        let result = await getAll(req.body);

        return resultResMsg(res, result);

    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        await check("name", "Provide a valid product name").not().isEmpty().isString().run(req);
        await check("price", "Provide a valid price").not().isEmpty().isNumeric()
        .custom((val) => val > 0).custom((val) => /^[1-9]\d*(\.\d+)?$/.test(val)).run(req);
        await check("image", "Provide a valid image url").not().isEmpty().isURL().run(req);
        await check("minimumQuantity", "Provide a valid minimum quantity").not().isEmpty().isInt().custom((val) => val > 0).run(req);
        await check("discountRate", "Provide a valid discount rate").not().isEmpty().isNumeric().run(req);
        await check("category", "Provide a valid category").not().isEmpty().isMongoId().custom(isValidCategory).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await create(req.body);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const fetchProduct = async (req: Request, res: Response) => {
    try {
        await check("productId", "Provide a valid product id").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await getOne(req.params.productId);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        await check("productId", "Provide a valid product id").not().isEmpty().isString().run(req);
        await check("name", "Provide a valid product name").optional().isString().run(req);
        await check("price", "Provide a valid price").optional().isNumeric()
        .custom((val) => val > 0).custom((val) => /^[1-9]\d*(\.\d+)?$/.test(val)).run(req);
        await check("image", "Provide a valid image url").optional().isURL().run(req);
        await check("minimumQuantity", "Provide a valid minimum quantity").optional().isInt().custom((val) => val > 0).run(req);
        await check("discountRate", "Provide a valid discount rate").optional().isNumeric().run(req);
        await check("category", "Provide a valid category").optional().isMongoId().custom(isValidCategory).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await update(req.params.productId, req.body);

        return resultResMsg(res, result);

    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await check("productId", "Provide a valid product id").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await remove(req.params.productId);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const fetchUploadUrl = async (req: Request, res: Response) => {
    try {
        await check("fileName", "Provide a valid file name").not().isEmpty().isString().run(req);
        await check("fileType", "Provide a valid file type").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await generateUploadUrl(req.body);

        return resultResMsg(res, result);

    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}