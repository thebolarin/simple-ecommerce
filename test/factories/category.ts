import { Category } from '../../src/models/category';
import faker from 'faker';

/**
* Generate an object which container attributes needed
* to successfully create a category instance.
* 
* @param  {Object} props Properties to use for the category.
* 
* @return {Object}       An object to build the category from.
*/
const data = async (props = {}) => {
    const defaultProps = {
        name: faker.commerce.productName(),
        code: faker.lorem.word()
    };
    return Object.assign({}, defaultProps, props);
};

/**
* Generates a category instance from the properties provided.
* 
* @param  {Object} props Properties to use for the category.
* 
* @return {Object}       A category instance
*/
export default async (props = {}) => {
    try{
        const category = Category.build(await data(props));
        return await category.save();
    }catch(err){
        console.log(err)
    }
}
