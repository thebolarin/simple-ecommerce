import { NextFunction } from 'express';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import redis from '../config/redis-client';
import redisKeys from '../config/redis-key-gen';
const client = redis.getClient();

interface ProductAttrs {
    name: string;
    code: string;
    price: number;
    image: string;
    minimumQuantity: number;
    discountRate: number;
    category: mongoose.ObjectId
}

interface ProductDoc extends mongoose.Document {
    name: string;
    code: string;
    price: number;
    image: string;
    minimumQuantity: number;
    discountRate: number;
    category: mongoose.ObjectId
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        minimumQuantity: {
            type: Number,
            required: true,
        },
        discountRate: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

productSchema.virtual('discountPrice').get(function () {
    let discountRatePrice = this.discountRate / 100 * this.price
    let discountPrice = this.price - discountRatePrice
    return discountPrice;
});

let autoPopulated = function (next: NextFunction) {
    this.populate('category', 'name code');
    next();
}

productSchema.
pre('findOne', autoPopulated).
pre('find', autoPopulated);

productSchema.post('save', function() {
    deleteProductFromCache();
});

productSchema.post('remove', function() {
    deleteProductFromCache();
});

const deleteProductFromCache = async () => {
    const keyId = redisKeys.getKey(`Products_*`);
    console.log(`Deleting products from cache....`);
    let rows = await client.keys(keyId);
    rows.forEach(row => client.unlink(row));
};
    
productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };