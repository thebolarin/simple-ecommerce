import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;
beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.JWT_KEY = 'asdfasdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    console.log(mongoUri)

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    jest.setTimeout(50000);
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});
