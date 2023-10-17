import express from 'express';
import weekController from './week.controller.js';
import { isAuth } from '../auth/auth.middlewares.js';
const weekRouters = express.Router();

weekRouters.get('/', isAuth, weekController.getWeek);
weekRouters.get('/weekNo', isAuth, weekController.getWeekByWeekNo);
weekRouters.post('/', isAuth, weekController.createWeek);
weekRouters.put('/weekNo', isAuth, weekController.updateWeekByWeekNo);
weekRouters.delete('/weekNo', isAuth, weekController.deleteWeekByWeekNo);

export default weekRouters;
