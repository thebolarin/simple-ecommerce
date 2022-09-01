import express from 'express'
import userRoutes from './user';
import categoryRoutes from './category';
import productRoutes from './product';

const Router = express.Router()

Router.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello 🌍"
    });
});

Router.use('/user', userRoutes);
Router.use('/category', categoryRoutes);
Router.use('/product', productRoutes);

export default Router


