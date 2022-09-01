import { ObjectId } from 'mongoose';
import { S3 } from "aws-sdk"
import { checkKey } from './../config/s3';
import { Product } from '../models/product';
import redis from '../config/redis-client';
import redisKeys from '../config/redis-key-gen';
const client = redis.getClient();

interface ProductPayload {
    name: string,
    price: number,
    image: string,
    minimumQuantity: number,
    discountRate: number,
    category: ObjectId
}

interface ProductUploadPayload {
    fileName: string,
    fileType: string
}

export const getAll = async (queryString: any) => {
    try {
        let pageOptions = {
            page: queryString.page || 0,
            limit: (queryString.limit ? (queryString.limit > 100 ? 100 : queryString.limit) : 25)
        }

        let query: any = {};

        if (queryString.name && queryString.name != '') query.name = queryString.name;
        if (queryString.code && queryString.code != '') query.code = queryString.code;
        if (queryString.category && queryString.category != '') query.category = queryString.category;

        const productsCount = await Product.countDocuments(query).exec();

        const product = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit * 1)
            .exec();

        const { page, limit } = pageOptions;
        const keyId = redisKeys.getKey(`Products_${page}_${limit}`);

        const fetchProducts = async () => {
            const product = await Product.find(query)
                .sort({ createdAt: -1 })
                .skip(pageOptions.page * pageOptions.limit)
                .limit(pageOptions.limit * 1)
                .exec();

            client.set(keyId, JSON.stringify(product));

            return {
                status: "success",
                statusCode: 200,
                message: "Product record fetched successfully.",
                data: {
                    product,
                    total: productsCount,
                    pages: Math.ceil(productsCount / pageOptions.limit),
                    page: pageOptions.page,
                    limit: pageOptions.limit
                }
            }
        };

        try {
            const value = await client.get(keyId);

            let result = JSON.parse(value);

            if (queryString.name || queryString.code || queryString.category) {
                console.log('Fetching all products from db. Query present....')
                return fetchProducts();
            }

            if (result) {
                console.log('Fetching request from cache ....')
                return {
                    status: "success",
                    statusCode: 200,
                    message: "Product record fetched successfully.",
                    data: {
                        product,
                        total: productsCount,
                        pages: Math.ceil(productsCount / pageOptions.limit),
                        page: pageOptions.page,
                        limit: pageOptions.limit
                    }
                }
            }

            console.log('Fetching products from db ....');
            return fetchProducts();
        } catch (err) {
            console.error("Error occured while fetching from catch", err);
            return fetchProducts();
        }

    } catch (err) {
        return {
            status: "error", statusCode: 500,
            message: "Invalid Request",
            data: err
        }
    }
}

export const create = async (payload: ProductPayload) => {
    try {
        const { name, price, image, minimumQuantity, discountRate, category } = payload;

        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return {
                status: "error", statusCode: 400,
                message: "Product already exists"
            };
        }

        const product = Product.build({
            name,
            code: `PRO-${Date.now()}`,
            price,
            image,
            minimumQuantity,
            discountRate,
            category
        });

        await product.save();

        return {
            status: "success", statusCode: 201,
            message: "Product created successfully",
            data: product
        }

    } catch (err) {
        return {
            status: "error", statusCode: 500, message: "Invalid Request",
            data: err
        }
    }
}

export const getOne = async (productId: string) => {
    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return { status: "error", statusCode: 404, message: "Product not found" };
        }

        return {
            status: "success", statusCode: 200,
            message: "Product fetched successfully",
            data: product
        };


    } catch (err) {
        return {
            status: "error", statusCode: 500, message: "Invalid Request",
            data: err
        }
    }
}

export const update = async (productId: string, payload: ProductPayload) => {
    const { name, price, image, minimumQuantity, discountRate, category } = payload;
    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return { status: "error", statusCode: 400, message: "Category not found" };
        }

        let updateObject: any = {};

        if (name) updateObject.name = name;
        if (price) updateObject.price = price;
        if (image) updateObject.image = image;
        if (minimumQuantity) updateObject.minimumQuantity = minimumQuantity;
        if (discountRate) updateObject.discountRate = discountRate;
        if (category) updateObject.category = category;

        product.set(updateObject);
        await product.save();

        return {
            status: "success", statusCode: 200, message: "Product fetched successfully",
            data: product
        };
    } catch (err) {
        return { status: "error", statusCode: 500, message: "Invalid Request", data: err }
    }
}

export const remove = async (productId: string) => {
    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return { status: "error", statusCode: 400, message: "Product not found" };
        }

        await product.remove();

        return { status: "success", statusCode: 200, message: "Product deleted successfully" };
    } catch (err) {
        return { status: "error", statusCode: 500, message: "Invalid Request", data: err }
    }
}

export const generateUploadUrl = async (payload: ProductUploadPayload) => {
    try {
        const { fileName, fileType } = payload;

        let filePath = `product/${fileName}`;

        let checkExists = await checkKey(filePath);

        if (checkExists) {
            return { status: "success", statusCode: 200, message: "File already exists in storage" };
        }

        let s3 = new S3({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            signatureVersion: 'v4',
            region: process.env.S3_REGION
        });

        const signedUrl = await s3.getSignedUrl('putObject', {
            Bucket: process.env.S3_BUCKET,
            Key: filePath,
            Expires: 120,
            ContentType: fileType,
            ACL: 'public-read'
        });

        return {
            status: "success",
            statusCode: 200,
            message: "Url generated successfully.",
            data: {
                preSignedUrl: signedUrl,
                downloadUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${filePath}`
            }
        }
    } catch (err) {
        return {
            status: "error",
            statusCode: 500,
            message: "Invalid Request",
            data: err
        };
    }
}