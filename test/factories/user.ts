import { createUser } from './../../src/services/user';
import faker from 'faker';

/**
* Generate an object which container attributes needed
* to successfully create a user instance.
* 
* @param  {Object} props Properties to use for the user.
* 
* @return {Object}       An object to build the user from.
*/
const data = async (props = {}) => {
    const defaultProps = {
        userName: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.lorem.word(5),
    };
    return Object.assign({}, defaultProps, props);
};

/**
* Generates a user instance from the properties provided.
* 
* @param  {Object} props Properties to use for the user.
* 
* @return {Object}       A user instance
*/
export default async (props = {}) => {
    const result = await createUser(await data(props))
   return result.data
}
