import { verifyToken } from './../common/middlewares/auth';
import { deleteCategory, fetchCategory, updateCategory, fetchCategories, createCategory } from './../controllers/category';
import express from 'express'

const Router = express.Router();

Router.get('/', verifyToken, fetchCategories);
Router.post('/', verifyToken, createCategory);
Router.get('/:categoryId', verifyToken, fetchCategory);
Router.put('/:categoryId', verifyToken, updateCategory);
Router.delete('/:categoryId', verifyToken, deleteCategory);

export default Router;