import userFactory from './factories/user';
import request from 'supertest';
import { app } from '../src/app';
import mongoose from 'mongoose';
import { User } from '../src/models/user';

let commonHeaders = { authorization: "xxx" };

describe('user ', () => {
    it('can fetch a list of users', async () => {
        await userFactory();
        await userFactory();
        await userFactory();

        const response = await request(app)
            .get('/api/user')
            .set(commonHeaders)
            .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.total).toEqual(3);
    });

    it('returns a 404 if the user is not found', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();

        await request(app)
            .get(`/api/user/${id}`)
            .set(commonHeaders)
            .expect(404);
    });

    it('returns the user if the user is found', async () => {
        const user: any = await userFactory({ userName: "new user" });

        const userResponse = await request(app)
            .get(`/api/user/${user._id}`)
            .set(commonHeaders)
            .expect(200);

        expect(userResponse.body.data.userName).toEqual("new user");
        expect(userResponse.body.data.email).toEqual(user.email);
    });

    it('has a route handler listening to /api/user/register for post requests', async () => {
        const response = await request(app).post('/api/user/register').send({});

        expect(response.status).not.toEqual(404);
    });

    it('returns an error if an invalid input is provided', async () => {
        await request(app)
            .post('/api/user/register')
            .send({
                price: 10,
            })
            .expect(400);
    });

    it('registers a user with valid inputs', async () => {
        let users = await User.find({});
        expect(users.length).toEqual(0);

        await request(app)
            .post('/api/user/register')
            .send({ userName: "new user", email: "xxx@test.com", password: "password" })
            .expect(201);

        users = await User.find({});
        expect(users.length).toEqual(1);
        expect(users[0].userName).toEqual("new user");
    });

    it('has a route handler listening to /api/user/login for post requests', async () => {
        const response = await request(app).post('/api/user/login').send({});

        expect(response.status).not.toEqual(404);
    });

    it('returns an error if an invalid input is provided', async () => {
        await request(app)
            .post('/api/user/login')
            .send({
                email: "xxx@test.com",
            })
            .expect(400);
    });

    it('login a user with valid inputs', async () => {
        await userFactory({ userName: "new user", email: "xxx@test.com", password: "password" });

        const result = await request(app)
            .post('/api/user/login')
            .send({ email: "xxx@test.com", password: "password" })
            .expect(200);

        expect(result.body.data.existingUser.email).toEqual("xxx@test.com");
        expect(result.body.data.userJwt).toBeDefined
        expect(result.body.data.refreshToken).toBeDefined
    });
});

