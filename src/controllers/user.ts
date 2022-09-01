import { getAll, getOne, update, remove, refreshJWTToken, logout } from './../services/user';
import { ResMsg, BadRequestError, resultResMsg } from './../util/index';
import { createUser, signInUser } from './../services/user';
import express, { Request, Response } from 'express';
import { check, body, validationResult } from 'express-validator';

type CustomRequest = Request & { [key: string]: any }

export const fetchUsers = async (req: CustomRequest, res: Response) => {
    try {
        let result = await getAll(req.body);

        return resultResMsg(res, result);

    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const fetchUser = async (req: Request, res: Response) => {
    try {
        await check("userId", "Provide a valid user id").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await getOne(req.params.userId);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        await check("userName", "Provide a valid userName").not().isEmpty().isString().run(req);
        await check("email", "Provide a valid email").not().isEmpty().isEmail().run(req);
        await check('password', "Password must be between 4 and 20 characters").not().isEmpty().trim()
            .isLength({ min: 4, max: 20 }).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        const result = await createUser(req.body);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        await check("email", "Provide a valid email").not().isEmpty().isEmail().run(req);
        await check('password', "Password must be between 4 and 20 characters").not().isEmpty().trim()
            .isLength({ min: 4, max: 20 }).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        const result = await signInUser(req.body);
        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const currentUser = async (req: CustomRequest, res: Response) => {
    try {
        let currentUser = req.currentUser || null;

        return ResMsg(res, 200, 'success', 'Current User Fetched successfully', currentUser);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        await check("userId", "Provide a valid user id").not().isEmpty().isString().run(req);
        await check("name", "Provide a valid userName").optional().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await update(req.params.userId, req.body);

        return resultResMsg(res, result);

    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await check("userId", "Provide a valid user id").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        let result = await remove(req.params.userId);

        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const refreshJWTAccessToken = async (req: Request, res: Response) => {
    try {
        await check("refreshToken", "Provide a valid refresh token").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        const result = await refreshJWTToken(req.body.refreshToken);
        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        await check("refreshToken", "Provide a valid refresh token").not().isEmpty().isString().run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return BadRequestError(res, errors.array({ onlyFirstError: true }));
        }

        const result = await logout(req.body.refreshToken);
        return resultResMsg(res, result);
    } catch (err) {
        return ResMsg(res, 500, 'error', 'Invalid Request', err);
    }
}
