import { Product } from '../../src/models/product';
import faker from 'faker';
import categoryFactory from './category'

/**
* Generate an object which container attributes needed
* to successfully create a product instance.
* 
* @param  {Object} props Properties to use for the product.
* 
* @return {Object}       An object to build the product from.
*/
const data = async (props = {}) => {
    const category:any = await categoryFactory();

    const defaultProps = {
        name: faker.commerce.productName(),
        code: faker.lorem.word(),
        price: faker.datatype.number(),
        image: faker.image.imageUrl(),
        minimumQuantity: faker.datatype.number(),
        discountRate: faker.datatype.number(),
        category: category._id
    };
    return Object.assign({}, defaultProps, props);
};

/**
* Generates a product instance from the properties provided.
* 
* @param  {Object} props Properties to use for the product.
* 
* @return {Object}       A product instance
*/
export default async (props = {}) => {
    const product = Product.build(await data(props));
    return await product.save();
}
