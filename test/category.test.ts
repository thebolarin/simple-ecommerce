import categoryFactory from './factories/category';
import request from 'supertest';
import { app } from '../src/app';
import mongoose from 'mongoose';
import { Category } from '../src/models/category';

let commonHeaders = { authorization: "xxx" };

describe('category ', () => {
    it('can fetch a list of categories', async () => {
        await categoryFactory();
        await categoryFactory();
        await categoryFactory();

        const response = await request(app)
            .get('/api/category')
            .set(commonHeaders)
            .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.total).toEqual(3);
    });

    it('returns a 404 if the category is not found', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();

        await request(app)
            .get(`/api/category/${id}`)
            .set(commonHeaders)
            .expect(404);
    });

    it('returns the category if the category is found', async () => {
        const category: any = await categoryFactory({ name: "new category" });

        const categoryResponse = await request(app)
            .get(`/api/category/${category._id}`)
            .set(commonHeaders)
            .expect(200);

        expect(categoryResponse.body.data.name).toEqual("new category");
        expect(categoryResponse.body.data.code).toEqual(category.code);
    });

    it('has a route handler listening to /api/category for post requests', async () => {
        const response = await request(app).post('/api/category').send({});

        expect(response.status).not.toEqual(404);
    });

    it('can only be accessed if the user is signed in', async () => {
        await request(app).post('/api/category').send({}).expect(401);
    });

    it('returns a status other than 401 if the user is signed in', async () => {
        const response = await request(app)
            .post('/api/category')
            .set(commonHeaders)
            .send({});

        expect(response.status).not.toEqual(401);
    });

    it('returns an error if an invalid input is provided', async () => {
        await request(app)
            .post('/api/category')
            .set(commonHeaders)
            .send({
                price: 10,
            })
            .expect(400);

    });

    it('creates a category with valid inputs', async () => {
        let categories = await Category.find({});
        expect(categories.length).toEqual(0);

        const name = "new category";

        await request(app)
            .post('/api/category')
            .set(commonHeaders)
            .send({ name })
            .expect(201);

        categories = await Category.find({});
        expect(categories.length).toEqual(1);
        expect(categories[0].name).toEqual(name);
    });
});

