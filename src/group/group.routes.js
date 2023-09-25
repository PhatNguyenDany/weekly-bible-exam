import express from 'express';
import groupController from './group.controller.js';
import { isAuth } from '../auth/auth.middlewares.js';
const groupRouters = express.Router();

groupRouters.get('/', isAuth, groupController.getGroup);
groupRouters.get('/:groupName', isAuth, groupController.getGroupByGroupName);
groupRouters.get('/age', isAuth, groupController.getGroupByAge);
groupRouters.get('/:groupId', isAuth, groupController.getGroupByGroupId);
groupRouters.post('/', isAuth, groupController.createGroup);
groupRouters.put('/:groupId', isAuth, groupController.updateGroupByGroupId);
groupRouters.delete('/:groupId', isAuth, groupController.deleteGroupByGroupId);

export default groupRouters;
