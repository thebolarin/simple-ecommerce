import { ResMsg, BadRequestError, resultResMsg } from './../util/index';
import { create, getAll, getOne, update, remove } from './../services/category';
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

export const fetchCategories = async (req: Request, res: Response) => {
    try {
        let result = await getAll(req.body);

        return resultResMsg(res, result);

    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        await check("name", "Provide a valid userName").not().isEmpty().isString().run(req);

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

export const fetchCategory = async (req: Request, res: Response) => {
    try {
        await check("categoryId", "Provide a valid category id").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await getOne(req.params.categoryId);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        await check("categoryId", "Provide a valid category id").not().isEmpty().isString().run(req);
        await check("name", "Provide a valid userName").optional().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await update(req.params.categoryId, req.body);

        return resultResMsg(res, result);

    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await check("categoryId", "Provide a valid category id").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await remove(req.params.categoryId);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}