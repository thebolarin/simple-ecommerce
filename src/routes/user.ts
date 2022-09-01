import { fetchUsers, refreshJWTAccessToken, logoutUser } from './../controllers/user';
import express from 'express'
import { registerUser, login, currentUser, fetchUser, updateUser, deleteUser } from '../controllers/user'
import { verifyToken } from './../common/middlewares/auth';

const Router = express.Router();

Router.get('/', verifyToken, fetchUsers);
Router.get('/me',verifyToken, currentUser);
Router.get('/:userId', verifyToken, fetchUser);
Router.post('/register', registerUser);
Router.post('/login', login);
Router.post('/token/refresh', refreshJWTAccessToken);
Router.put('/:userId', verifyToken, updateUser);
Router.delete('/logout', verifyToken, logoutUser);
Router.delete('/:userId', verifyToken, deleteUser);

export default Router;