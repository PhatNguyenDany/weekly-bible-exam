import express from 'express';
import questionController from './question.controller.js';
import { isAuth } from '../auth/auth.middlewares.js';
const questionRouters = express.Router();

questionRouters.get('/', isAuth, questionController.getQuestion);
// questionRouters.get('/quizId', isAuth, questionController.getQuestionByQuizId);
// questionRouters.get('/weekQuizIds', isAuth, questionController.getQuestionByWeekQuizIds);
// questionRouters.post('/', isAuth, questionController.createQuestion);
// questionRouters.put('/quizId', isAuth, questionController.updateQuestionByQuizId);
// questionRouters.delete('/quizId', isAuth, questionController.deleteQuestionByQuizId);

export default questionRouters;
