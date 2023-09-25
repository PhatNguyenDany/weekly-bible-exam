import express from 'express';
import userController from './user.controller.js';
import { isAuth } from '../auth/auth.middlewares.js';
const userRouters = express.Router();

userRouters.get('/', isAuth, userController.getUser);
userRouters.put('/', isAuth, userController.updateUser);
userRouters.put('/:id', isAuth, userController.updateUserById);
userRouters.delete('/', isAuth, userController.deleteUserProfile);
userRouters.delete('/:id', isAuth, userController.deleteUserById);

export default userRouters;
