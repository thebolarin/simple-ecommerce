import categoryFactory from './factories/category';
import request from 'supertest';
import { app } from '../src/app';
import productFactory from './factories/product'
import mongoose from 'mongoose';
import { Product } from '../src/models/product';
import faker from 'faker';

let commonHeaders = { authorization: "xxx" };

describe('product ', () => {
  it('can fetch a list of products', async () => {
    await productFactory();
    await productFactory();
    await productFactory();

    const response = await request(app)
      .get('/api/product')
      .set(commonHeaders)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.total).toEqual(3);
  });

  it('returns a 404 if the product is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`/api/product/${id}`)
      .set(commonHeaders)
      .expect(404);
  });

  it('returns the product if the product is found', async () => {
    const product = await productFactory({ name: "new product" });

    const productResponse = await request(app)
      .get(`/api/product/${product._id}`)
      .set(commonHeaders)
      .expect(200);

    expect(productResponse.body.data.name).toEqual("new product");
    expect(productResponse.body.data.code).toEqual(product.code);
  });

  it('has a route handler listening to /api/product for post requests', async () => {
    const response = await request(app).post('/api/product').send({});

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/product').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
      .post('/api/product')
      .set(commonHeaders)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid input is provided', async () => {
    await request(app)
      .post('/api/product')
      .set(commonHeaders)
      .send({
        price: 10,
      })
      .expect(400);

    await request(app)
      .post('/api/product')
      .set(commonHeaders)
      .send({
        name: "new",
      })
      .expect(400);
  });

  it('creates a product with valid inputs', async () => {
    const category: any = await categoryFactory();
    let products = await Product.find({});
    expect(products.length).toEqual(0);

    const name = "new product";

    await request(app)
      .post('/api/product')
      .set(commonHeaders)
      .send({
        name,
        code: faker.lorem.word(),
        price: 20.3,
        image: faker.image.imageUrl(),
        minimumQuantity: faker.datatype.number(),
        discountRate: faker.datatype.number(),
        category: category._id
      })
      .expect(201);

    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].price).toEqual(20.3);
    expect(products[0].name).toEqual(name);
  });
});

