import { verifyToken } from './../common/middlewares/auth';
import { deleteProduct, fetchProduct, updateProduct, fetchProducts, createProduct, fetchUploadUrl } from './../controllers/product';
import express from 'express'

const Router = express.Router();

Router.get('/', verifyToken, fetchProducts);
Router.post('/', verifyToken, createProduct);
Router.get('/:productId', verifyToken, fetchProduct);
Router.get('/upload/url', verifyToken, fetchUploadUrl);
Router.put('/:productId', verifyToken, updateProduct);
Router.delete('/:productId', verifyToken, deleteProduct);

export default Router;