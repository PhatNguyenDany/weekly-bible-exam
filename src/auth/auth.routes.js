import express from 'express';
import authController from './auth.controller.js';
const authRouters = express.Router();

authRouters.post('/login', authController.login);
authRouters.post('/register', authController.register);
export default authRouters;
